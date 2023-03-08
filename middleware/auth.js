const jwt = require("jsonwebtoken")

module.exports =  async function Auth(req,res,next){
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token,'secret');
        req.user = decodedToken ;
        res.json(decodedToken);
    } catch (error) {
        res.status(401).json({error: "Authentication failed."});
    }
}
