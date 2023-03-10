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
    
    let {email, name} = req.body;
    email = email.toLowerCase();
    const OTP = req.app.locals.OTP;

     var mail = {
        body: {
            name: name,
            intro: OTP || 'Welcome to my application.',
            outro: 'Enter this OTP to verify.'
        }
    }

    var emailBody = MailGenerator.generate(mail);

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP verification",
        html: emailBody
    }

    transporter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg: "You shuold recieve an email from us."})
        })
        .catch(error => res.status(500).send({error}))

}


module.exports = registerMail;