const User  = require('../models/User.js');
const jwt = require('jsonwebtoken');
const optGenerator = require('otp-generator');
const otpGenerator = require('otp-generator');
const Chat = require('../models/Chat');

async function register(req,res){
    try {
        let {name, email, password} = req.body;

        email = email.toLowerCase();

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
        let {email, password} = req.body;

        email = email.toLowerCase();

        const foundUser = await User.findOne({email: email});
        if(!foundUser){
            // return res.status(500).send({error: "Username do not exist."});
            return res.send({error: "User do not exist."});
        } else {
            if(foundUser.password === password){
                const token = jwt.sign({
                    userId: foundUser._id,
                    username: foundUser.email
                },'secret',{expiresIn: "24h"})

                // return res.status(201).send({msg: "Logged In", username: foundUser.email, token})
                return res.status(201).send({msg: "Logged In", username: foundUser.email, token})
            }
            else
                // return res.status(500).send({error: "Incorrect Password"});
                return res.send({error: "Incorrect Password"});

        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

async function getUser(req,res){
    try {
        let {email} = req.params;
        
        if(!email) return res.status(501).send({error: 'Invalid username'});
        email = email.toLowerCase();
        
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

async function generateOTP(req,res,next){
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        // res.status(201).send({code: req.app.locals.OTP});
        next();
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
            return res.send({msg: "Verified successfully"});
        }
        return res.send({error: "Invalid OTP."})
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
        if(!req.app.locals.resetSession) return res.send({error: "Session expired."});
        
        const {email, password} = req.body;
        let newPassword = password;

        const foundUser = await User.findOne({email: email});

        if(!foundUser) return res.send({error: "User not found"});
        const updated = await User.updateOne({email: foundUser.email}, {password: newPassword});
        if(updated){
            return res.send({msg: "Password reset successfull."});
        }
        return res.send({error: "Unsuccessfull."});
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function recoverPassword(req,res){
    try {
        // if(!req.app.locals.resetSession) return res.send({error: "Session expired."});
        
        let {email, password} = req.body;
        email = email.toLowerCase();
        let newPassword = password;

        const foundUser = await User.findOne({email: email});
        console.log("user");
        if(!foundUser) return res.send({error: "User not found"});
        const updated = await User.updateOne({email: foundUser.email}, {password: newPassword});
        if(updated){
            return res.send({msg: "Password reset successfull."});
        }
        return res.send({error: "Unsuccessfull."});
    } catch (error) {
        return res.status(501).send(error);
    }
}

async function verifyUser(req,res,next){
    try {
        let {email} = req.method == 'GET' ? req.query : req.body ;
        email = email.toLowerCase();

        const exist = User.findOne({email});
        if(!exist) return res.status(501).send({error: "Can't find user."})
        next();
    } catch (error) {
        return next(error);
    }
}

async function checkUserExist(req,res){
    try {
        let {email} = req.params ;
        email = email.toLowerCase();
        const exist = await User.findOne({email: email});
        if(!exist) return res.send({msg: "Can't find user."})
        return res.send({error: 'User already exist.'});
    } catch (error) {
        return res.send(error);
    }
}

async function getUsersList(req,res){
    try {
        const usersList = await User.find({});
        let {email} = req.query;
        email = email.toLowerCase();

        let dataToSend = [];
        usersList.map((user) => {
            if(user.email !== email){
                dataToSend.push({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                })
            }
        });
        return res.send(dataToSend);
    } catch (error) {
        return res.send(error);
    }
}

async function createChat(req,res){
    try {
        let {sender, reciever} = req.body;
        sender = sender.toLowerCase();
        reciever = reciever.toLowerCase();

        const id = sender+reciever;

        const found = await Chat.findOne({id: id});

        if(found){
            return res.status(500).send({error: "Chat already exist."});
        }

        await Chat.create({
            id: id,
            messages: []
        })
        return res.status(201).send({msg: "Registered successfully"});

    } catch (error) {
        return res.send(error);
    }
}

async function sendMessage(req,res){
    try {
        let {text, sender, reciever, time} = req.body;
        sender = sender.toLowerCase();
        reciever = reciever.toLowerCase();

        const id = sender+reciever;

        const found = await Chat.findOne({id: id});

        if(found){
            const newMessage = {
                text: text,
                sender: sender,
                reciever: reciever,
                time: time
            }

            const messages = found.messages;
            await found.updateOne({messages: [newMessage, ...messages]});

            return res.status(201).send({msg: "Message sent"});
        }
        return res.status(500).send({error: "Chat don't exist."});
    } catch (error) {
        return res.send(error);
    }
}

async function getAllMessages(req,res){
    try {
        let {sender, reciever} = req.body;
        sender = sender.toLowerCase();
        reciever = reciever.toLowerCase();

        const id = sender+reciever;

        const found = await Chat.findOne({id: id});
        if(found){
            return res.status(201).send({messages: found.messages});
        }
        else{
            return res.status(500).send({error: "User don't exist."});
        }
    } catch (error) {
        return res.send(error);
    }
}

// async function getUsersList(req,res){
//     try {
        
//     } catch (error) {
//         return res.send(error);
//     }
// }


module.exports = {register, login, getUser, updateUser, createChat, recoverPassword, generateOTP, verifyOTP, createResetSession, resetPassword, verifyUser, checkUserExist, getUsersList, sendMessage, getAllMessages};