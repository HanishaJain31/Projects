const conn = require('../../config/db');
const { sendResponse } = require('../../utils/middleware');
const common = require('../../utils/common');

const adminModel = {

    //CRUD Jobs
    createJob: async (req, res) => {
    try {
        const userId = req.loginUser.id;
        const userRole = req.loginUser.role;

        const {
            job_name,
            company_name,
            location,
            latitude,
            longitude,
            job_salary,
            description,
            status,
            experience_required,
            job_type,
            skills = []
        } = req.body;

        if (userRole !== 'admin') {
            return sendResponse( req, res, 403, '0', { keyword: 'forbidden_access', components: {} },{} );
        }

        const [jobResult] = await conn.query(
            `INSERT INTO tbl_job
            (job_name, company_name, location, latitude, longitude,
             job_salary, description, status, experience_required, job_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ job_name, company_name, location, latitude, longitude, job_salary, description, status, experience_required, job_type]
        );

        const jobId = jobResult.insertId;

        // Validate and map skills
        for (const skillId of skills) {
            const [skill] = await conn.query(
                `SELECT id FROM tbl_skills WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [skillId]
            );

            if (skill.length === 0) {
                return sendResponse( req, res, 400, '0', { keyword: 'invalid_skill_id', components: { skillId } }, {}
                );
            }

            const [skillResult] = await conn.query(
                `INSERT INTO tbl_job_skills (job_id, skill_id)
                 VALUES (?, ?)`,
                [jobId, skillId]
            );

            if (skillResult.affectedRows === 0) {
                return sendResponse( req, res, 500, '0', {keyword: 'error_associating_skill', components: {} }, {}
                );
            }
        }

        return sendResponse(
            req,
            res,
            200,
            '1',
            {
                keyword: 'job_created_successfully',
                components: {}
            },
            {}
        );

        } catch (error) {
            return sendResponse( req, res, 500, '0', {keyword: 'error_creating_job',components: {} }, {});
        }
    },


    //search jobs by name, filter by status, sort by salary
    viewAllJobs: async (req, res) => {
        try {
            const { job_id } = req.params;
        
            const { page = 1, limit = 10, search = '', status = '', sort = '' } = req.body || {};
        
            const offset = (page - 1) * limit;
        
            let query = `
            SELECT id, job_name, company_name, location, job_salary, description, description AS job_description, status, created_at
            FROM tbl_job
            WHERE is_deleted = 0
            `;
        
            const queryParams = [];
        
            // Job ID filter
            if (job_id) {
                query += ` AND id = ?`;
                queryParams.push(job_id);
            }
        
            // Search by job name
            if (search) {
                query += ` AND job_name LIKE ?`;
                queryParams.push(`%${search}%`);
            }
        
            // Filter by status
            if (status) {
                query += ` AND status = ?`;
                queryParams.push(status);
            }
        
            // Sort by salary
            if (sort && ['ASC', 'DESC'].includes(sort.toUpperCase())) {
                query += ` ORDER BY job_salary ${sort.toUpperCase()}`;
            } else {
                query += ` ORDER BY created_at DESC`;
            }
        
            // Pagination only for listing API
            if (!job_id) {
                query += ` LIMIT ? OFFSET ?`;
                queryParams.push(Number(limit), Number(offset));
            }

            // Count total records for pagination
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM tbl_job
                WHERE is_deleted = 0
                ${search ? 'AND job_name LIKE ?' : ''}
                ${status ? 'AND status = ?' : ''}
            `;

            const [countResult] = await conn.query(countQuery, queryParams);
            const totalRecords = countResult[0]?.total || 0;
        
            const [result] = await conn.query(query, queryParams);

        
            if (result.length === 0) {
                return sendResponse( req, res, 200, "0", { keyword: "job_fetched_failed" }, {});
            }
        
            return sendResponse( req, res, 200, "1", { keyword: "jobs_fetched_successfully" }, { result: result, total: totalRecords });
        
        } catch (error) {
            console.log(error);
            return sendResponse( req, res, 500, "0", { keyword: "internal_server_error" }, {} );
        }
    },

    updateJob: async (req, res) => {
    try {
        const userRole = req.loginUser.role;
        const { job_id } = req.params;

        if (userRole !== 'admin') {
            return sendResponse( req, res, 403, '0', { keyword: 'forbidden_access', components: {} }, {});
        }

        const { skills, ...jobFields } = req.body;

        // Check job exists
        const [job] = await conn.query(
            `SELECT id FROM tbl_job WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
            [job_id]
        );

        if (job.length === 0) {
            return sendResponse( req, res, 200, '2', { keyword: 'job_not_found', components: {} }, {}
            );
        }

        const allowedFields = [
            'job_name',
            'company_name',
            'location',
            'latitude',
            'longitude',
            'job_salary',
            'description',
            'status',
            'experience_required',
            'job_type'
        ];

        const fieldsToUpdate = allowedFields.filter((field) => jobFields[field] !== undefined);

        if (fieldsToUpdate.length > 0) {
            const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(', ');
            const values = fieldsToUpdate.map((field) => jobFields[field]);

            await conn.query(
                `UPDATE tbl_job SET ${setClause} WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [...values, job_id]
            );
        }

        if (Array.isArray(skills)) {
            await conn.query(
                `DELETE FROM tbl_job_skills WHERE job_id = ?`,
                [job_id]
            );

            for (const skillId of skills) {

                const [skill] = await conn.query(
                    `SELECT id FROM tbl_skills WHERE id = ?`,
                    [skillId]
                );

                if (skill.length === 0) {
                    return sendResponse( req, res, 400, '0', { keyword: 'invalid_skill_id',components: {} }, {}
                    );
                }

                await conn.query(
                    `INSERT INTO tbl_job_skills (job_id, skill_id)
                     VALUES (?, ?)`,
                    [job_id, skillId]
                );
            }
        }
        return sendResponse( req, res, 200, '1', { keyword: 'job_updated_successfully', components: {} }, {}
        );

        } catch (error) {
            console.log(error);
            return sendResponse( req, res, 500, '0', {keyword: 'error_updating_job', components: {} }, {}
            );
        }
    },

    deleteJob: async (req, res) => {
        try{
            const userRole = req.loginUser.role;
            if (userRole !== 'admin') {
                return sendResponse( req, res, 403, '0', { keyword: 'forbidden_access', components: {} }, {}
                );
            }
            const { job_id } = req.params;
            const [job] = await conn.query(
                `SELECT id FROM tbl_job WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [job_id]
            );
            if (job.length === 0) {
                return sendResponse( req, res, 200, '2', { keyword: 'job_not_found', components: {} }, {}
                );
            }
            const [result] = await conn.query(
                `UPDATE tbl_job SET is_deleted = 1, is_active = 0 WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [job_id]
            );
            if(result.affectedRows === 1){
                await conn.query(
                    `DELETE FROM tbl_job_skills WHERE job_id = ?`,
                    [job_id]
                )
                return sendResponse( req, res, 200, '1', { keyword: 'job_deleted_successfully', components: {} }, {}
                )
            }
            else{
                return sendResponse( req, res, 200, '0', { keyword: 'failed_to_delete_job', components: {} }, {}
                )
            }

        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_deleting_job', components: {} }, {});
        }
    },

    dashboardStats: async (req, res) => {
        try{
            const [stats] = await conn.query(
                `SELECT
                    (SELECT COUNT(*) FROM tbl_job WHERE is_deleted = 0 AND is_active = 1) AS total_jobs,
                    (SELECT COUNT(*) FROM tbl_job WHERE is_deleted = 0 AND is_active = 1 AND status = 'active') AS active_jobs,
                    (SELECT COUNT(*) FROM tbl_job WHERE is_deleted = 0 AND is_active = 1 AND status = 'closed') AS closed_jobs,
                    (SELECT COUNT(*) FROM tbl_job_application WHERE is_deleted = 0 AND is_active = 1) AS total_application,
                    (SELECT COUNT(*) FROM tbl_user WHERE is_deleted = 0 AND is_active = 1 AND role = 'user') AS total_users
                `
            );

            if(stats.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_stats_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'dashboard_stats_fetched_successfully', components: {} }, stats);
            }
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_fetching_dashboard_stats', components: {} }, {});
        }
    },

    viewAllUsers: async (req, res) => {
        try{

            const { page = 1, limit = 10, status = 'active', search } = req.body;
            const offset = (page - 1) * limit;

            let whereCondition = `WHERE role = 'user'`;
            let queryParams = [];

            //search by name
            if(search){
                whereCondition += ` AND name LIKE ?`;
                queryParams.push(`%${search}%`);
            }

            //status filter
            if(status === 'active'){
                whereCondition += ` AND is_active = 1 AND is_deleted = 0`;
            }
            else if(status === 'inactive'){
                whereCondition += ` AND is_active = 0 AND is_deleted = 1`;
            }
            else if(status === 'all'){
                whereCondition += ` AND (is_active = 1 OR is_deleted = 1)`;
            }

            const [countResult] = await conn.query(
                `SELECT COUNT(*) AS total
                FROM tbl_user
                ${whereCondition}`,
                queryParams
            );
            const totalRecords = countResult[0]?.total || 0;

            const [users] = await conn.query(
                `SELECT id, name, email, job_role, is_active
                FROM tbl_user
                ${whereCondition}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?`,
                [...queryParams, parseInt(limit), parseInt(offset)]
            );
            
            if(users.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_user_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'users_fetched_successfully', components: {} }, { users, total: totalRecords });
            }
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_fetching_users', components: {} }, {});
        }
    },

    updateUserStatus: async (req, res) => {
        try{
            const { user_id } = req.body;

            const [user] = await conn.query(
                `SELECT id FROM tbl_user WHERE id = ? AND role = 'user' AND (is_active = 1 OR is_deleted = 1)`,
                [user_id]
            )

            if(user.length === 0){
                return sendResponse(req, res, 200, '2', { keyword: 'user_not_found', components: {} }, {});
            }

            //toggle user status 
            const [result] = await conn.query(
                `UPDATE tbl_user SET is_active = IF(is_active = 1, 0, 1), is_deleted = IF(is_deleted = 1, 0, 1) WHERE id = ?`,
                [user_id]
            );

            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'user_status_updated_successfully', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_update_user_status', components: {} }, {});
            }
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_updating_user_status', components: {} }, {});
        }
    },

    viewAllApplications: async (req, res) => {
        try{
            const { page = 1, limit = 10, status } = req.body;
            const offset = (page - 1) * limit;

            let whereCondition = '';
            let queryParams = [];
            if(status && status !== 'all'){
                whereCondition += ` AND a.status = ?`;
                queryParams.push(status);
            }

            const [countResult] = await conn.query(
                `SELECT COUNT(*) AS total
                FROM tbl_job_application a
                JOIN tbl_job j ON a.job_id = j.id AND j.is_active = 1 AND j.is_deleted = 0
                JOIN tbl_user u ON a.user_id = u.id AND u.is_active = 1 AND u.is_deleted = 0
                WHERE a.is_deleted = 0 AND a.is_active = 1 ${whereCondition}`,
                queryParams
            );
            const totalRecords = countResult[0]?.total || 0;
            
            const [applications] = await conn.query(
                `SELECT a.id, a.job_id, a.candidate_name, a.phone_number, a.job_applied, a.status, j.job_name, a.user_id, u.name AS user_name,  a.resume, a.cover_letter, a.created_at
                FROM tbl_job_application a
                JOIN tbl_job j ON a.job_id = j.id AND j.is_active = 1 AND j.is_deleted = 0
                JOIN tbl_user u ON a.user_id = u.id AND u.is_active = 1 AND u.is_deleted = 0
                WHERE a.is_deleted = 0 AND a.is_active = 1 ${whereCondition}
                ORDER BY a.created_at DESC
                LIMIT ? OFFSET ?`,
                [...queryParams, parseInt(limit), parseInt(offset)]
            );

            if(applications.length === 0){
                return sendResponse(req, res, 200, '0', { keyword: 'no_applications_found', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '1', { keyword: 'applications_fetched_successfully', components: {} }, { applications, total: totalRecords });
            }
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_fetching_applications', components: {} }, {});
        }
    },

    updateApplicationStatus: async (req, res) => {
        try{
            const { application_id, status } = req.body;

            const [application] = await conn.query(
                `SELECT id FROM tbl_job_application WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [application_id]
            );

            if(application.length === 0){
                return sendResponse(req, res, 200, '2', { keyword: 'application_not_found', components: {} }, {});
            }

            const [result] = await conn.query(
                `UPDATE tbl_job_application SET status = ? WHERE id = ? AND is_active = 1 AND is_deleted = 0`,
                [status, application_id]
            );

            if(result.affectedRows === 1){
                return sendResponse(req, res, 200, '1', { keyword: 'application_status_updated_successfully', components: {} }, {});
            }
            else{
                return sendResponse(req, res, 200, '0', { keyword: 'failed_to_update_application_status', components: {} }, {});
            }
        }
        catch(error){
            console.log(error);
            return sendResponse(req, res, 500, '0', { keyword: 'error_updating_application_status', components: {} }, {});
        }
    }
}
    
module.exports = adminModel;
