const jwt = require("jsonwebtoken")

async function Auth(req,res,next){
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token,'secret');
        req.user = decodedToken ;
        next();
    } catch (error) {
        res.status(401).json({error: "Authentication failed."});
    }
}

function localVariables(req,res,next){
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

module.exports = {Auth, localVariables};
