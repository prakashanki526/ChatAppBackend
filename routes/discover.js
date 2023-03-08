const { Router } = require("express");
const router = Router();
const User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const {Auth, localVariables} = require("../middleware/auth.js");
const {register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser} = require('../controllers/appController.js');


// post methods
router.route('/register').post(register);
// router.route('/registerMail').post();
router.route('/authenticate').post((req,res)=>res.end());
router.route('/login').post(verifyUser,login);

// get methods
router.route('/user/:email').get(getUser);
router.route('/generateOTP').get(verifyUser,localVariables, generateOTP);
router.route('/verifyOTP').get(verifyOTP);
router.route('/createResetSession').get(createResetSession);

// put methods
router.route('/updateUser').put(Auth,updateUser);
router.route('/resetPassword').put(verifyUser,resetPassword);


module.exports = router ;

