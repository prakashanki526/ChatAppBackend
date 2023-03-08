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
    
    const {name, userEmail, text, subject} = req.body;

     var email = {
        body: {
            name: name,
            intro: text || 'Welcome to my application.',
            outro: 'Need help, or have question?'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || "Signup successfull",
        html: emailBody
    }

    console.log(message);

    transporter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg: "You shuold recieve an email from us."})
        })
        .catch(error => res.status(500).send({error}))

}

// let nodeConfig = {
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL, // generated ethereal user
//       pass: process.env.PASSWORD, // generated ethereal password
//     },
// }

// let transporter = nodemailer.createTransport(nodeConfig);

// let MailGenerator = new Mailgen({
//     theme: "default",
//     product: {
//         name: "Mailgen",
//         link: 'https://mailgen.js'
//     }
// })

// const registerMail = async(req,res) => {
//     const {name, userEmail, text, subject} = req.body;

//     var email = {
//         body: {
//             name: name,
//             intro: text || 'Welcome to my application.',
//             outro: 'Need help, or have question?'
//         }
//     }

//     var emailBody = MailGenerator.generate(email);

//     let message = {
//         from: process.env.EMAIL,
//         to: userEmail,
//         subject: subject || "Signup successfull",
//         html: emailBody
//     }

//     transporter.sendMail(message)
//         .then(()=>{
//             return res.status(200).send({msg: "You shuold recieve an email from us."})
//         })
//         .catch(error => res.status(500).send({error}))
// }


module.exports = registerMail;