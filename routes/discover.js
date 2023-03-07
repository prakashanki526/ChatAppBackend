const { Router } = require("express");
const route = Router();
const User = require('../models/User.js');


// post methods

route.post("/register",async(req,res,next)=>{
    try {
        const {name, email, password} = req.body;

        const foundUser = await User.findOne({email: email});
        if(!foundUser){
            await User.create({name,email,password});
            res.status(201).send({msg: "Registered successfully"});
        } else {
            res.status(500).send({msg: "User already exist."});
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})

route.post("/registerMail",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(err);
        next(error);
    }
})

route.post("/authenticate",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(err);
        next(error);
    }
})

route.post("/login",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(err);
        next(error);
    }
})


// get methods

route.get("/user/:username",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})

route.get("/generateOTP",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})

route.get("/verifyOTP",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})

route.get("/createResetSession",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})


// put methods

route.put("/updateUser",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error);
    }
})

route.put("/resetPassword",async(req,res,next)=>{
    try {
        
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = route ;

