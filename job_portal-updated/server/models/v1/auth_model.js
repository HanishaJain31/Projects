const conn = require('../../config/db');
// const bcrypt = require('bcrypt');
const { sendResponse } = require('../../utils/middleware');
const common = require('../../utils/common');
const bcrypt = require('bcrypt');

const authModel = {
    signup: async (req, res) => {
        try {
            const { name, email, password, phone_number, role, job_role, resume, device_token, device_type, device_name, device_model, os_version, uuid, ip } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const existingEmail = await common.checkExistingEmail(req, res, email);
            if (!existingEmail) {
                return;
            }
            const existingPhone = await common.checkExistingPhone(req, res, phone_number);
            if(!existingPhone){
                return;
            }

            const resumePath = req.file ? req.file.path : null;
      
            const result = await conn.query(
                `INSERT INTO tbl_user (name, email, password, phone_number, role, job_role, resume_path)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, phone_number, role, job_role, resumePath]
            );

            if (!result[0].insertId) {
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_create_user', components: {} }, {});
            }

            const userId = result[0].insertId;

            const token = await common.generateToken(userId, role, device_token, device_type, device_name, device_model, os_version, uuid, ip);
            const userDetail = await common.getUserDetails(userId, token);

            return sendResponse(req, res, 200, '1', { keyword: 'signup_successful', components: {} }, {
                userDetail: userDetail,
                token: token
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_signup', components: {} }, {});
        }
    },

    //Login of the user
    login: async (req, res) => {
        try{
            const {email, password, device_token, device_type, device_name, device_model, os_version, uuid, ip } = req.body || {}
            console.log(req.body)

            const [user] = await conn.query(`SELECT * FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted = 0`, [email])
            if(user.length === 0){
                return sendResponse(req, res, 200, '2', {keyword: 'user_not_found', components: {}}, {})
            }

            const isPasswordValid = await bcrypt.compare(password, user[0].password)

            if(!isPasswordValid){
                return sendResponse(req, res, 200, '0', { keyword: 'invalid_password', components: {} }, {})
            }

            const token = await common.generateToken(user[0].id, user[0].role, device_token, device_type, device_name, device_model, os_version, uuid, ip)
            console.log(token)
        
            const userDetail = await common.getUserDetails(user[0].id, token)

            return sendResponse(req, res, 200, '1', { keyword: 'login_successful', components: {} }, {
                userDetail: userDetail,
                token: token
            })
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_login', components: {} }, {});
        }
    },

    changePassword: async (req, res) => {
        try{
            const { old_password, new_password } = req.body || {}
            const userId = req.loginUser.id

            const [user] = await conn.query(`SELECT * FROM tbl_user WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [userId])
            if(user.length === 0){
                return sendResponse(req, res, 200, '2', {keyword: 'user_not_found', components: {}}, {})
            }

            const isPasswordValid = await bcrypt.compare(old_password, user[0].password)
            if(!isPasswordValid){
                return sendResponse(req, res, 200, '0', { keyword: 'invalid_old_password', components: {} }, {})
            }
            if(old_password === new_password){
                return sendResponse(req, res, 200, '0', { keyword: 'new_password_cannot_be_same_as_old_password', components: {} }, {})
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            const [result] = await conn.query(`UPDATE tbl_user SET password = ? WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [hashedPassword, userId])
            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'password_changed_successfully', components: {} }, {})
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_change_password', components: {} }, {})
            }

        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_password_change', components: {} }, {});
        }
    },

    logout: async (req, res) => {
        try{
            const userId = req.loginUser.id
            const token = req.token;
            const role = req.loginUser.role;

            if(role === 'admin'){
                [result] = await conn.query(`UPDATE tbl_admin_device SET is_active = 0, is_deleted = 1, token = '', device_token = '' WHERE admin_id = ? and token = ?`, [userId, token]);
            }
            else if(req.loginUser.role === 'user'){
                [result] = await conn.query(`UPDATE tbl_user_device SET is_active = 0, is_deleted = 1, token = '', device_token = '' WHERE user_id = ? AND token = ?`, [userId, token]);
            }

            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'logout_successful', components: {} }, {})
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_logout', components: {} }, {})
            }

        }
        catch(error){   
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_logout', components: {} }, {});
        }
    },

    editProfile: async (req, res) => {
        try{
            const userId = req.loginUser.id;
            const { name, email, phone_number, job_role } = req.body;

            if(!userId){
                return sendResponse(req, res, 200, '2', {keyword: 'user_not_found', components: {}}, {})
            }

            const [user] = await conn.query(`SELECT * FROM tbl_user WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [userId])
            if(email && user[0].email !== email){
                const existingEmail = await common.checkExistingEmail(req, res, email);
                if(!existingEmail){
                    return;
                }
            }
            if(phone_number && user[0].phone_number !== phone_number){
                const existingPhone = await common.checkExistingPhone(req, res, phone_number);
                if(!existingPhone){
                    return;
                }
            }

            const current = user[0];

            const updatedName = name || current.name;
            const updatedEmail = email || current.email;
            const updatedPhoneNumber = phone_number || current.phone_number;
            const updatedJobRole = job_role || current.job_role;

            if( updatedName === current.name && updatedEmail === current.email && updatedPhoneNumber === current.phone_number && updatedJobRole === current.job_role){
                return sendResponse(req, res, 200, '0', { keyword: 'no_changes_made', components: {} }, {})
            }

            const [result] = await conn.query(`UPDATE tbl_user SET name = ?, email = ?, phone_number = ?, job_role = ? WHERE id = ?`, [updatedName, updatedEmail, updatedPhoneNumber, updatedJobRole, userId])
            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'profile_updated_successfully', components: {} }, {})
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_update_profile', components: {} }, {})
            }

        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_profile_edit', components: {} }, {});
        }
    },
    
    viewProfile: async (req, res) => {
        try{
            const userId = req.loginUser.id;
            const [user] = await conn.query(`SELECT id, name, email, phone_number, role, job_role, resume_path FROM tbl_user WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [userId])

            if(user.length === 0){
                return sendResponse(req, res, 200, '2', {keyword: 'user_not_found', components: {}}, {})
            }
            return sendResponse(req, res, 200, '1', { keyword: 'profile_fetched_successfully', components: {} }, user)
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_during_view_profile', components: {} }, {});
        }
    }

}

module.exports = authModel;