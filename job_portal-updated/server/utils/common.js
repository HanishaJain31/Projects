const jwt = require("jsonwebtoken")
const conn = require('../config/db');
const { sendResponse } = require("./middleware");


const common = {
    jwt_sign: (data, expiresIn = "365days") => {
        const enc_data = {
            expiresIn,
            data: data
        }

        const token = jwt.sign(enc_data, process.env.JWT_SECRET_KEY);

        return token
    },

    generateToken : async (id, role, device_token, device_type, device_model, device_name, os_version, uuid, ip) => {
    try{
        if(!id || !role){
            throw new Error('User ID and role are required to generate token');
        }
        const deviceValues = [
            device_token,
            device_type,
            device_model,
            device_name,
            os_version,
            uuid,
            ip
        ].map((value) => value ?? null);

        if(role === "admin"){
            const [admin] = await conn.execute('SELECT * FROM tbl_user WHERE id = ? and role = "admin"', [id]);
            const token = common.jwt_sign({
                id: admin[0].id,
                role: role,
                email: admin[0].email
            });

            const [insertToken] = await conn.query('INSERT INTO tbl_admin_device (admin_id, token, device_token, device_type, device_model, device_name, os_version, uuid, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, token, ...deviceValues]);

            return token;
        }
        if(role === "user"){
            const [user] = await conn.execute('SELECT * FROM tbl_user WHERE id = ?', [id]);
            const token = common.jwt_sign({
                id: user[0].id,
                role: role,
                email: user[0].email
            });
            const [insertToken] = await conn.query('INSERT INTO tbl_user_device (user_id, token, device_token, device_type, device_model, device_name, os_version, uuid, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, token, ...deviceValues]);
            return token;
        }
    }
    catch(error){
        console.log(error)
        throw new Error('Error generating token');
    }
    },
    
    getUserDetails: async (user_id, token = null) => {
        try {
            if (token !== null) {
                const [[user]] = await conn.query(
                    `SELECT role FROM tbl_user WHERE id = ?`,
                    [user_id]
                );
                const role = user?.role;
                
                if(role === 'user'){
                    const [result] = await conn.query(`
                        SELECT u.id as user_id, u.name, u.email, u.job_role, u.phone_number, u.role,
                        ud.token AS auth_token,ud.device_token,ud.device_type,ud.device_name,ud.device_model,ud.os_version,ud.uuid,ud.ip
                        FROM tbl_user u
                        LEFT JOIN tbl_user_device ud ON u.id = ud.user_id AND ud.token = ?
                        WHERE u.id = ?`, [token, user_id]);
                    return result[0];
                }else{
                    const [result] = await conn.query(`
                        SELECT u.id as user_id, u.name, u.email, u.job_role, u.phone_number, u.role,
                        ud.token AS auth_token,ud.device_token,ud.device_type,ud.device_name,ud.device_model,ud.os_version,ud.uuid,ud.ip
                        FROM tbl_user u
                        LEFT JOIN tbl_admin_device ud ON u.id = ud.admin_id AND ud.token = ?
                        WHERE u.id = ?`, [token, user_id]);
                    return result[0];
                }
                if (result.length > 0) {
                    return result[0];
                }
            }
            else if (token === null) {
                const [result] = await conn.query(`
                SELECT u.id as user_id, u.name, u.email, u.job_role, u.phone_number, u.role
                FROM tbl_user u
                WHERE u.id = ?`, [user_id]);
                if (result.length > 0) {
                    return result[0];
                };
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to retrieve user information");
        }
    },

    checkExistingEmail: async (req, res, email) => {
        try{
            const [result] = await conn.query(`SELECT id FROM tbl_user WHERE email = ?`, [email]);

            if(result.length > 0){
                return sendResponse(req, res, 200, '0', { keyword: 'email_already_exists', components: {} }, {})
                return false;
            }
            return true;
        }
        catch(error){
            console.log(error);
            throw new Error("Error checking existing email");
        }
    },

    checkExistingPhone: async (req, res, phone_number) => {
        try{
            const [result] = await conn.query(`SELECT id FROM tbl_user WHERE phone_number = ?`, [phone_number]);

            if(result.length > 0){
                sendResponse(req, res, 200, '0', { keyword: 'phone_number_already_exists', components: {} }, {}) 
                return false;
            }
            return true;
        }
        catch(error){
            console.log(error);
            throw new Error("Error checking existing phone number");
        }
    },
}

module.exports = common;
