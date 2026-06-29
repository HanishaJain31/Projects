const conn = require('../../config/db');
const { sendResponse } = require('../../utils/middleware');
const common = require('../../utils/common');

const userModel = {
    userDashboard: async (req, res) => {
        try{
            const userId = req.loginUser.id;

            const [result] = await conn.query(
                `SELECT
                    (SELECT COUNT(*) FROM tbl_job_application WHERE user_id = ?) AS total_applications,
                    (SELECT COUNT(*) FROM tbl_job_application WHERE user_id = ? AND status = 'pending') AS pending_applications,
                    (SELECT COUNT(*) FROM tbl_job_application WHERE user_id = ? AND status = 'approved') AS approved_applications,
                    (SELECT COUNT(*) FROM tbl_job_application WHERE user_id = ? AND status = 'rejected') AS rejected_applications`
                , [userId, userId, userId, userId]
            );
            
            if(result.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_data_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'dashboard_stats', components: {} }, { result });
            }
        }
        catch(error){
            console.error('Error in userDashboard:', error);
            return sendResponse(req, res, 500, '0', { keyword: 'internal_server_error', components: {} }, {});
        }
    },

    applyForJob: async (req, res) => {
        try{
            const userId = req.loginUser.id;
            const { job_id, candidate_name, email, phone_number, job_applied, resume, cover_letter } = req.body;

            const [jobResult] = await conn.query(`SELECT id, status FROM tbl_job WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [job_id]);
            if(jobResult.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'job_not_found', components: {} }, {});
            }

            if(String(jobResult[0].status || '').trim().toLowerCase() === 'closed'){
                return sendResponse(req, res, 200, '0', { keyword: 'job_closed', components: {} }, {});
            }

            //upload resume through multer and get the file path
            const resumePath = `${process.env.BASE_PATH}${req.file ? req.file.filename : null}`;
            
            const [result] = await conn.query(
                `INSERT INTO tbl_job_application (user_id, job_id, candidate_name, email, phone_number, job_applied, resume, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, job_id, candidate_name, email, phone_number, job_applied, resumePath, cover_letter]
            );

            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'job_applied_successfully', components: {} }, { });
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'job_application_failed', components: {} }, {});
            }
            

        }
        catch(error){
            console.error('Error in applyForJob:', error);
            return sendResponse(req, res, 500, '0', { keyword: 'internal_server_error', components: {} }, {});
        }
    },

    viewallJobs: async (req, res) => {
        try {
            let { page = 1, limit = 10, search, sort, job_type, location, min_salary, max_salary, status } = req.body || {};
    
            page = Number(page);
            limit = Number(limit);
            min_salary = min_salary != null ? Number(min_salary) : null;
            max_salary = max_salary != null ? Number(max_salary) : null;
        
            const offset = (page - 1) * limit;
        
            let query = `
                SELECT j.id, j.job_name, j.company_name, j.location, j.job_salary,
                    j.description, j.description AS job_description,
                    j.experience_required, j.job_type, j.status, j.is_active, j.created_at,
                    GROUP_CONCAT(s.name) AS skills
                FROM tbl_job j
                LEFT JOIN tbl_job_skills js ON j.id = js.job_id AND js.is_active = 1 AND js.is_deleted = 0
                LEFT JOIN tbl_skills s ON js.skill_id = s.id AND s.is_active = 1 AND s.is_deleted = 0
                WHERE 1=1`;
        
            const params = [];
        
            // Search
            if (search) {
                query += ` AND (j.job_name LIKE ? OR j.company_name LIKE ? OR j.location LIKE ? OR s.name LIKE ?)`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }
        
            // Job Type Filter
            if (job_type) {
                query += ` AND j.job_type = ?`;
                params.push(job_type);
            }
        
            // Location Filter
            if (location) {
                query += ` AND j.location = ?`;
                params.push(location);
            }
        
            // Salary Range Filter
            if (min_salary != null && max_salary != null) {
                query += ` AND j.job_salary BETWEEN ? AND ?`;
                params.push(min_salary, max_salary);
            } else if (min_salary != null) {
                query += ` AND j.job_salary >= ?`;
                params.push(min_salary);
            } else if (max_salary != null) {
                query += ` AND j.job_salary <= ?`;
                params.push(max_salary);
            }
        
            // Status Filter
            if (status) {
                query += ` AND j.status = ?`;
                params.push(status);
            }
        
            query += ` GROUP BY j.id`;

            // Sorting
            switch (sort) {
                case "salary_asc":
                query += ` ORDER BY j.job_salary ASC`;
                break;
        
                case "salary_desc":
                query += ` ORDER BY j.job_salary DESC`;
                break;
        
                case "name_asc":
                query += ` ORDER BY j.job_name ASC`;
                break;
        
                case "name_desc":
                query += ` ORDER BY j.job_name DESC`;
                break;
        
                default:
                query += ` ORDER BY j.created_at DESC`;
            }
        
            // Pagination
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            // Count total records for pagination
            const countQuery = `
                SELECT COUNT(DISTINCT j.id) as total
                FROM tbl_job j
                LEFT JOIN tbl_job_skills js ON j.id = js.job_id AND js.is_active = 1 AND js.is_deleted = 0
                LEFT JOIN tbl_skills s ON js.skill_id = s.id AND s.is_active = 1 AND s.is_deleted = 0
                WHERE 1=1` +
                (search ? ` AND (j.job_name LIKE ? OR j.company_name LIKE ? OR j.location LIKE ? OR s.name LIKE ?)` : '') +
                (job_type ? ` AND j.job_type = ?` : '') +
                (location ? ` AND j.location = ?` : '') +
                (min_salary != null && max_salary != null ? ` AND j.job_salary BETWEEN ? AND ?` : '') +
                (min_salary != null && max_salary == null ? ` AND j.job_salary >= ?` : '') +
                (min_salary == null && max_salary != null ? ` AND j.job_salary <= ?` : '') +
                (status ? ` AND j.status = ?` : '');
            const countParams = [
                ...(search ? [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : []),
                ...(job_type ? [job_type] : []),
                ...(location ? [location] : []),
                ...(min_salary != null && max_salary != null ? [min_salary, max_salary] : []),
                ...(min_salary != null && max_salary == null ? [min_salary] : []),
                ...(min_salary == null && max_salary != null ? [max_salary] : []),
                ...(status ? [status] : [])
            ];

            const [countResult] = await conn.query(countQuery, countParams);
            const totalRecords = countResult[0].total;

            console.log(totalRecords)
        
            const [result] = await conn.query(query, params);
        
            if (!result.length) { 
                return sendResponse( req, res, 200, "0", { keyword: "no_jobs_found" }, {}, );
            }
        
            return sendResponse( req, res, 200, "1", { keyword: "jobs_fetched_successfully" }, {result, totalRecords});
        } 
        catch (error) {
            console.log("viewJobs Error:", error);
            return sendResponse( req, res, 500, "0", { keyword: "internal_server_error" }, {},);
        }
    },
 
    viewJobById: async (req, res) => {
        try{
            const { id } = req.params;
            console.log(id)

            const [jobResult] = await conn.query(`SELECT id FROM tbl_job WHERE id = ? AND is_active = 1 AND is_deleted = 0`, [id]);
            if(jobResult.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'job_not_found', components: {} }, {});
            }

            const [result] = await conn.query(
                `SELECT j.id, j.job_name, j.company_name, j.location, j.latitude, j.longitude,
                    j.job_salary, j.description, j.description AS job_description, j.status, j.experience_required, j.job_type,
                    GROUP_CONCAT(s.name) AS skills, j.created_at
                FROM tbl_job j
                LEFT JOIN tbl_job_skills js ON j.id = js.job_id AND js.is_active = 1 AND js.is_deleted = 0
                LEFT JOIN tbl_skills s ON js.skill_id = s.id AND s.is_active = 1 AND s.is_deleted = 0
                WHERE j.id = ? AND j.is_active = 1 AND j.is_deleted = 0
                GROUP BY j.id`,
                [id]
            );

            if(result.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_data_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'job_details', components: {} }, result);
            }
        }
        catch(error){
            console.error('Error in viewAllJobs:', error);
            return sendResponse(req, res, 500, '0', { keyword: 'internal_server_error', components: {} }, {});
        }
    },

    appliedJobs: async (req, res) => {
        try{
            const userId = req.loginUser.id;

            const [result] = await conn.query(
                `SELECT ja.id, j.job_name AS job_title, ja.job_applied, j.company_name, ja.status, ja.created_at as applied_date
                FROM tbl_job_application ja
                JOIN tbl_job j ON ja.job_id = j.id AND j.is_active = 1 AND j.is_deleted = 0
                WHERE ja.user_id = ? AND ja.is_active = 1 AND ja.is_deleted = 0`, [userId]
            );
            if(result.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_data_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'applied_jobs_fetched_successfully', components: {} }, result);
            }
        }
        catch(error){
            console.error('Error in appliedJobs:', error);
            return sendResponse(req, res, 500, '0', { keyword: 'internal_server_error', components: {} }, {});
        }
    },


}
    
module.exports = userModel;
