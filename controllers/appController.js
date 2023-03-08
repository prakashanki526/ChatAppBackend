const User  = require('../models/User.js');
const jwt = require('jsonwebtoken');
const optGenerator = require('otp-generator');
const otpGenerator = require('otp-generator');

async function register(req,res){
    try {
        const {name, email, password} = req.body;

        const foundUser = await User.findOne({email: email});
        if(!foundUser){
            await User.create({name,email,password});
            return res.status(201).send({msg: "Registered successfully"});
        } else {
            return res.status(500).send({error: "User already exist."});
        }

    } catch (error) {
        return res.status(500).send(error);
    }
}

async function login(req,res){
    try {
        const {email, password} = req.body;

        const foundUser = await User.findOne({email});
        if(!foundUser){
            res.status(500).send({error: "Username do not exist."});
        } else {
            if(foundUser.password === password){
                const token = jwt.sign({
                    userId: foundUser._id,
                    username: foundUser.email
                },'secret',{expiresIn: "24h"})

                return res.status(201).send({msg: "Logged In", username: foundUser.email, token})
            }
            else
                return res.status(500).send({error: "Incorrect Password"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getUser(req,res){
    try {
        const {email} = req.params;
        
        if(!email) return res.status(501).send({error: 'Invalid username'});

        const foundUser = await User.findOne({email: email});

        if(!foundUser) return res.status(501).send({error: 'User do not exist.'});

        const {password, ...rest} = Object.assign({},foundUser.toJSON());
        return res.status(201).send(rest);
    } catch (error) {
        return res.status(501).send({error: 'Cannot find user data.'});
    }
}

async function updateUser(req,res){
    try {
        const {userId} = req.user;

        if(userId){
            const body = req.body;

            const updated = await User.updateOne({_id: userId},body);
            if(!updated) throw err;
            return res.status(201).send({msg: "Record Updated."});
        }
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function generateOTP(req,res){
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        res.status(201).send({code: req.app.locals.OTP});
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function verifyOTP(req,res){
    try {
        const {code} = req.query;
        if(parseInt(req.app.locals.OTP) === parseInt(code)){
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true; //start session for reset password
            return res.status(201).send({msg: "Verify successfully"});
        }
        return res.status(400).send({error: "Invalid OTP."})
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function createResetSession(req,res){
    try {
        if(req.app.locals.resetSession){
            req.app.locals.resetSession = false;
            return res.status(201).send({msg: "Access granted."});
        }
        return res.status(440).send({error: "Session expired."});
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function resetPassword(req,res){
    try {
        if(!req.app.locals.resetSession) return res.status(440).send({error: "Session expired."});
        
        const {email, password} = req.body;
        let newPassword = password;

        const foundUser = await User.findOne({email: email});
        if(!foundUser) return res.status(404).send({error: "User not found"});
        const updated = await User.updateOne({email: foundUser.email}, {password: newPassword});
        if(updated){
            return res.status(201).send({msg: "Password reset successfull."});
        }
        return res.status(501).send({error: "Unsuccessfull."});
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function verifyUser(req,res,next){
    try {
        const {email} = req.method == 'GET' ? req.query : req.body ;

        const exist = User.findOne({email});
        if(!exist) return res.status(501).send({error: "Can't find user."})
        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser};