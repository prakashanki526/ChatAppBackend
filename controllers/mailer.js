const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const dotenv = require('dotenv').config();


const registerMail = (req,res) => {
    let nodeConfig = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    
    let transporter = nodemailer.createTransport(nodeConfig);
    
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js'
            }
     })
    
    const {userEmail, OTP, subject} = req.body;

     var email = {
        body: {
            intro: OTP || 'Welcome to my application.',
            outro: 'Need help, or have question?'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || "OTP verification",
        html: emailBody
    }

    console.log(message);

    transporter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg: "You shuold recieve an email from us."})
        })
        .catch(error => res.status(500).send({error}))

}


module.exports = registerMail;