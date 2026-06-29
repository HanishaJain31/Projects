var express = require('express');
var router = express.Router();
var joi = require('joi');
var adminModel = require('../../models/v1/admin_model');

var { checkApiKey, validateJoi, checkAdminToken, checkUserToken, decryption, checkToken } = require("../../utils/middleware");

router.post('/create-job', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    job_name: joi.string().required(),
    company_name: joi.string().required(),
    location: joi.string().required(),
    latitude: joi.number().required(),
    longitude: joi.number().required(),
    job_salary: joi.number().required(),
    description: joi.string().required(),
    status: joi.string().valid('active', 'closed').required(),
    experience_required: joi.string().required(),
    job_type: joi.string().valid('full_time', 'part_time', 'contract', 'internship', 'remote').required(),
    skills: joi.array().items(joi.number()).required()
})), adminModel.createJob);

router.post(
    '/viewall-jobs',
    checkAdminToken,
    decryption,
    validateJoi(
        joi.object({
            page: joi.number().required(),
            limit: joi.number().required(),
            search: joi.string().optional(),
            sort: joi.string().valid('ASC', 'DESC').optional(),
            status: joi.string().valid('active', 'closed').optional()
        })
    ),
    adminModel.viewAllJobs
);

router.get('/viewall-jobs/:job_id', checkApiKey, checkAdminToken, adminModel.viewAllJobs);

router.post('/update-job/:job_id', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    job_name: joi.string().optional(),
    company_name: joi.string().optional(),
    location: joi.string().optional(),
    latitude: joi.number().optional(),
    longitude: joi.number().optional(),
    job_salary: joi.number().optional(),
    description: joi.string().optional(),
    status: joi.string().valid('active', 'closed').optional(),
    experience_required: joi.string().optional(),
    job_type: joi.string().valid('full_time', 'part_time', 'contract', 'internship', 'remote').optional(),
    skills: joi.array().items(joi.number()).optional()
})), adminModel.updateJob);

router.delete('/delete-job/:job_id', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
})), adminModel.deleteJob);

router.get('/dashboard-stats', checkApiKey, checkAdminToken, adminModel.dashboardStats);

router.post('/viewall-users', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    page: joi.number().required(),
    limit: joi.number().required(),
    status: joi.string().valid('active', 'inactive', 'all').optional(),
    search: joi.string().optional()
})), adminModel.viewAllUsers);

router.post('/viewall-users/:user_id', checkApiKey, checkAdminToken, adminModel.viewAllUsers);

router.post('/update-userstatus', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    user_id: joi.number().required()
})), adminModel.updateUserStatus);

router.post('/viewall-applications', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    page: joi.number().required(),
    limit: joi.number().required(),
    status: joi.string().valid('pending', 'approved', 'rejected', 'all').optional(),
})),adminModel.viewAllApplications);

router.post('/update-applicationstatus', checkApiKey, checkAdminToken, decryption, validateJoi(joi.object({
    application_id: joi.number().required(),
    status: joi.string().valid('approved', 'rejected').required()
})), adminModel.updateApplicationStatus)

module.exports = router;
