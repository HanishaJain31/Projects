var express = require('express');
var router = express.Router();
var joi = require('joi');
var authModel = require('../../models/v1/auth_model');

var { checkApiKey, validateJoi, checkAdminToken, checkUserToken, decryption, checkToken } = require("../../utils/middleware")

var uploadResume = require('../../utils/multer');

router.post('/signup', checkApiKey, uploadResume.single('resume'), decryption, validateJoi(joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    phone_number: joi.string().required(),
    role: joi.string().valid('admin', 'user').required(),
    job_role: joi.string().required(),
    device_token: joi.string().optional(),
    device_type: joi.string().optional(),
    device_name: joi.string().optional(),
    device_model: joi.string().optional(),
    os_version: joi.string().optional(),
    uuid: joi.string().optional(),
    ip: joi.string().optional()
})), authModel.signup)

router.post('/login', checkApiKey, decryption, validateJoi(joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    device_token: joi.string().optional(),
    device_type: joi.string().optional(),
    device_name: joi.string().optional(),
    device_model: joi.string().optional(),
    os_version: joi.string().optional(),
    uuid: joi.string().optional(),
    ip: joi.string().optional()
})), authModel.login)

router.post('/change-password', checkApiKey, checkToken, decryption, validateJoi(joi.object({
    old_password: joi.string().required(),
    new_password: joi.string().required()
})), authModel.changePassword)

router.post('/logout', checkApiKey, checkToken, decryption, authModel.logout)

router.post('/edit-profile', checkApiKey, checkToken, decryption, validateJoi(joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone_number: joi.string().required(),
    job_role: joi.string().optional().allow(''),
})), authModel.editProfile
)

router.get('/view-profile', checkApiKey, checkToken, authModel.viewProfile)

module.exports = router;
