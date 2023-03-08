const User  = require('../models/User.js');
const jwt = require('jsonwebtoken')

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
    
}

async function generateOTP(req,res){
    
}

async function verifyOTP(req,res){
    
}

async function createResetSession(req,res){
    
}

async function resetPassword(req,res){
    
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