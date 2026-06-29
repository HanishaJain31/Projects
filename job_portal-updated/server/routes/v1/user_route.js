var express = require('express');
var router = express.Router();
var joi = require('joi');
var multer = require('multer');
var userModel = require('../../models/v1/user_model');

var { checkApiKey, validateJoi, checkAdminToken, checkUserToken, decryption, checkToken } = require("../../utils/middleware");

var uploadResume = require('../../utils/multer');
const adminModel = require('../../models/v1/admin_model');

router.get('/dashboard', checkApiKey, checkUserToken, userModel.userDashboard);

router.post('/apply-for-job', checkApiKey, checkUserToken, uploadResume.single('resume'), decryption, validateJoi(joi.object({
    job_id: joi.number().integer().required(),
    candidate_name: joi.string().required(),
    email: joi.string().email().required(),
    phone_number: joi.string().required(),
    job_applied: joi.string().required(),
    cover_letter: joi.string().required()
})), userModel.applyForJob);

 
router.post('/viewall-jobs', checkApiKey, decryption, validateJoi(
    joi.object({
        page: joi.number().optional(),
        limit: joi.number().optional(),
        search: joi.string().optional(),
        sort: joi.string().valid('salary_asc', 'salary_desc', 'name_asc', 'name_desc').optional(),
        job_type: joi.string().valid('full_time', 'part_time', 'contract', 'internship', 'remote').optional(),
        location: joi.string().optional(),
        min_salary: joi.number().optional(),
        max_salary: joi.number().optional(),
        status: joi.string().valid('active', 'closed').optional()
    })
),
    userModel.viewallJobs
);

router.get('/view-job/:id', checkApiKey, userModel.viewJobById);

router.get('/applied-jobs', checkApiKey, checkUserToken, userModel.appliedJobs);

module.exports = router;
