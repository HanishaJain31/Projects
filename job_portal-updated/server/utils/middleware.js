const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const joi = require('joi')
const conn = require('../config/db');
// const cryptlib = require('cryptlib');
// const shaKey = cryptlib.getHashSha256(process.env.SHA_KEY, 32);
const { default: localizify, t } = require('localizify');
const eng = require("../languages/eng.js")
const hin = require("../languages/hin.js")
const guj = require("../languages/guj.js")
const CryptoJS = require("crypto-js");
// const key = process.env.SHA_KEY || "";
// const iv = process.env.IV || "";


// const sendResponse = (req, res, statusCode, code, { keyword = "failed", components = {} }, data = {}) => {
//     console.log(statusCode, code, keyword, components, data);
//     const message = translate(req, keyword, components);
//     const responseCode = keyword === "no_data" ? 2 : code;
//     const encrypted_data = {
//         code: String(responseCode),
//         message: message,
//         data: data,
//     };
//     // const encrypted_response = encryption(encrypted_data);
 
//     return res.status(statusCode).send(encrypted_data);
// };

function sendResponse(
  req,
  res,
  statusCode,
  responseCode,
  { keyword = "failed", components = {} },
  responseData,
) {
  const formatMsg =
    typeof keyword === "string"
      ? getMessage(req.headers?.["accept-language"], keyword, components)
      : keyword;
  if (keyword === "no_data") {
    responseCode = "3";
  }
 
  res.status(statusCode);
  res.send(encryption(
    {
      code: responseCode,
      message: formatMsg,
      data: responseData,
    },
  ));
}

// function checkApiKey (req, res, next) { 
//     const apiKey = req.headers['api-key'];
//     console.log(apiKey)

//     if (apiKey === process.env.API_KEY) {
//         return next();
//     }
//     console.log("check api maa ")
//     return sendResponse(req, res, 401, '-1', 'Invalid Api Key', {});
// }

function checkApiKey(req, res, next) {
  const apiKey = req.headers["api-key"];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    return sendResponse(
      req,
      res,
      401,
      "-1",
      { keyword: "invalid_api_key" },
      {},
    );
  }
}

const checkAdminToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['token'];
        
        if (!authHeader) {
            return sendResponse(req, res, 401, '-1', 'Token missing', {});
        }
        const token = authHeader.replace('Bearer ', '').trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const adminId = decoded.data.id;
        if (!adminId) {
            return sendResponse(req, res, 401, '-1', 'Invalid token payload', {});
        }

        const [device] = await conn.query(
            `SELECT id FROM tbl_admin_device 
             WHERE admin_id = ? AND token = ? AND is_active = 1 AND is_deleted = 0`,
            [adminId, token]
        );

        if (device.length === 0) {
            return sendResponse(req, res, 401, '-1', 'Invalid or logged out token', {});
        }

        req.loginUser = decoded.data;
        req.token = token;    
        next();
    }
    catch (error) {
        console.log("JWT Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return sendResponse(req, res, 401, '-1', 'Token expired', {});
        }
        if (error.name === 'JsonWebTokenError') {
            return sendResponse(req, res, 401, '-1', 'Invalid token', {});
        }
        return sendResponse(req, res, 500, '-1', 'Authentication error', {});
    }
};

const checkUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['token'];
        
        if (!authHeader) {
            return sendResponse(req, res, 401, '-1', 'Token missing', {});
        }
        const token = authHeader.replace('Bearer ', '').trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const userId = decoded.data.id;

        if (!userId) {
            return sendResponse(req, res, 401, '-1', 'Invalid token payload', {});
        }

        const [device] = await conn.query(
            `SELECT id FROM tbl_user_device 
             WHERE user_id = ? AND token = ? AND is_active = 1 AND is_deleted = 0`,
            [userId, token]
        );

        if (device.length === 0) {
            return sendResponse(req, res, 401, '-1', 'Invalid or logged out token', {});
        }

        req.loginUser = decoded.data;
        req.token = token;    
        next();
    }
    catch (error) {
        console.log("JWT Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return sendResponse(req, res, 401, '-1', 'Token expired', {});
        }
        if (error.name === 'JsonWebTokenError') {
            return sendResponse(req, res, 401, '-1', 'Invalid token', {});
        }
        return sendResponse(req, res, 500, '-1', 'Authentication error', {});
    }
};

const checkToken = async function (req, res, next) {
  try {
    const authHeader = req.headers["token"];
    const token = authHeader ? authHeader.replace("Bearer ", "").trim()
  : null;
 
    if (!token) {
      return sendResponse(
        req,
        res,
        401,
        "2",
        { keyword: "token_required" },
        {},
      );
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const role = decoded?.data?.role;
 
    if (role === "admin") {
      return await checkAdminToken(req, res, next);
    }
 
    if (role === "user") {
      return await checkUserToken(req, res, next);
    }
 
    return sendResponse(
      req,
      res,
      401,
      "-1",
      { keyword: "invalid_or_logged_out_token" },
      {},
    );
  } catch (error) {
    return sendResponse(
      req,
      res,
      401,
      "-1",
      { keyword: "invalid_or_logged_out_token" },
      {},
    );
  }
};

// const validateJoi = (schema) => {
//     return (req, res, next) => {
    
//         const { error } = schema.validate(req.body, {
//         abortEarly: false
//         });
    
//         if (error) {
//         const errors = {};

//         error.details.forEach(err => {
//             errors[err.path[0]] = err.message.replace(/"/g, '');
//         });
    
//         return sendResponse(req, res, 400, '-1',  errors,{});
//         }
//         next();
//     };
// };

const validateJoi = (schema) => {
    return (req,res,next)=>{
        console.log("BODY:", req.body);

        const { error } = schema.validate(req.body,{
            abortEarly:false
        });

        if(error){
            console.log(error.details);
            return sendResponse(req,res,400,'-1',{keyword:'validation_error'},{});
        }

        next();
    }
}

const encryption = (data) => {
  // Implement your encryption logic here
  try {
    const key = CryptoJS.enc.Utf8.parse(process.env.SHA_KEY || "");
    const iv = CryptoJS.enc.Utf8.parse(process.env.IV_KEY || "");
 
    if (!process.env.SHA_KEY || !process.env.IV_KEY) {
      throw new Error("Missing SHA_KEY or IV_KEY in environment variables");
    }
 
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    const encryptedData = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
    }).toString();
    return encryptedData;
  } catch (error) {
    console.log("Error in encryption: ", error);
    throw new Error("Encryption failed");
  }
};
 
const decryption = (req, res, next) => {
  if (req.body && Object.keys(req.body).length !== 0) {
    let encryptedBody = "";
 
    if (typeof req.body === "string") {
      encryptedBody = req.body;
    } else if (typeof req.body.data === "string") {
      encryptedBody = req.body.data;
    } else if (typeof req.body.payload === "string") {
      encryptedBody = req.body.payload;
    } else {
      // Request body is plain JSON, so skip AES decryption.
      return next();
    }
 
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedBody,
      CryptoJS.enc.Utf8.parse(process.env.SHA_KEY),
      { iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    ).toString(CryptoJS.enc.Utf8);
 
    let decryptionSend;
 
    try {
      decryptionSend = JSON.parse(decryptedData);
    } catch (error) {
      console.log("Error parsing decrypted data:", error.message);
      return sendResponse(
        req,
        res,
        400,
        "-1",
        { keyword: "invalid_encrypted_data" },
        {},
      );
      // return sendResponse(
      //   res,
      //   Codes.SUCCESS,
      //   Codes.RESPONSE_ERROR,
      //   "rest_keywords_error",
      //   null,
      // );
    }
 
    req.body = decryptionSend;
    return next();
  }
 
  return next();
};

// const getMessage = function (requestLanguage = 'eng', key, value) {
//     try {
//         localizify
//             .add('eng', eng)
//             .add('hin', hin)
//             .add('guj', guj)
//             .setLocale(requestLanguage);
//             console.log(requestLanguage)

//         let message = t(key, value);
 
//         return message;
//     } catch (e) {
//         console.log(e)
//         return "Something went wrong";
//     }
// }

const getMessage = function (requestLanguage = "eng", key, value) {
  try {
    localizify.add("eng", eng).add("hin", hin).setLocale(requestLanguage);
    let message = t(key, value);
    return message;
  } catch (e) {
    return "Something went wrong";
  }
};

// const encryption = function (response_data) {
//     return cryptlib.encrypt(JSON.stringify(response_data), shaKey, process.env.IV_KEY);
    
// }

// const decryption = function (req, res, next) {
//         try {
//             if (req.body != undefined && Object.keys(req.body).length !== 0) {
//                 req.body = JSON.parse(cryptlib.decrypt(req.body, shaKey, process.env.IV_KEY));

//                 next();
//             } else {
//                 next();
//             }
//         } catch (e) {
//             res.status(200);
//             res.json({ code: 0, message: "badEncrypt" });
//         }
// }

module.exports = {checkAdminToken, checkUserToken, checkApiKey, sendResponse, validateJoi, decryption, getMessage, checkToken}