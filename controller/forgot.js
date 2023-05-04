const nodemailer=require('nodemailer')
require('dotenv').config()

const genotp=()=>{
    return String(Date.now()).slice(-4)
}

const mail=(email,otp)=>{
    console.log(email)
    const transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        secure:'true',
        port:'4000',
        auth:{
            user:process.env.USER ,
            pass:process.env.PASSWORD
        }
    })

    var mailoptions={
        from:process.env.USER,
        to:email,
        subject:'OTP',
        text:otp
    }

    transporter.sendMail(mailoptions,(error,info)=>{
        if(error) console.log(error)
        else console.log('email sent'+info.response)
    })
    console.log('email sent successfully')
}

exports.genotp=genotp
exports.mail=mail