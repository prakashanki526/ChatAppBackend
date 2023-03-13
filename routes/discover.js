const { Router } = require("express");
const router = Router();
const User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const {Auth, localVariables} = require("../middleware/auth.js");
const {register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser, recoverPassword, checkUserExist, getUsersList, createChat, sendMessage, getAllMessages} = require('../controllers/appController.js');
const registerMail = require('../controllers/mailer.js');


// post methods
router.route('/register').post(register);
router.route('/registerMail').post(generateOTP,registerMail);
router.route('/authenticate').post(verifyUser,(req,res)=>res.end());
router.route('/login').post(verifyUser,login);
router.route('/recoverPassword').post(recoverPassword);
router.route('/createChat').post(createChat);
router.route('/sendMessage').post(sendMessage);

// get methods
router.route('/user/:email').get(getUser);
router.route('/generateOTP').get(localVariables, generateOTP);
router.route('/verifyOTP').get(verifyOTP);
router.route('/createResetSession').get(createResetSession);
router.route('/doesUserExist/:email').get(checkUserExist);
router.route('/getUsersList').get(verifyUser,getUsersList);
router.route('/getAllMessages').get(getAllMessages);

// put methods
router.route('/updateUser').put(Auth,updateUser);
router.route('/resetPassword').put(verifyUser,resetPassword);


module.exports = router ;

