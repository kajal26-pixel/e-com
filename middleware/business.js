const jwt=require('jsonwebtoken')
const Model=require('../models/index')
require('dotenv').config()

const business=async(req,res,next)=>{
    console.log('hey there')
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    console.log(tok)
    let ress=await Model.user.findOne({_id:tok.id})
    console.log(ress)
    if(ress.role=='Business'){
        next()

    }else{
        res.send('not eligible')
    }

}

exports.business=business