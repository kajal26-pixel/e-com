const jwt=require('jsonwebtoken')
const Model=require('../models/index')
require('dotenv').config()

const admin=async(req,res,next)=>{
    var ab=req.headers.auth
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    console.log(tok)
    let ress=await Model.user.findOne({_id:tok.id})
    console.log(ress)
    if(ress.role=='Admin'){
        next()

    }else{
        res.send('not eligible')
    }

}

exports.admin=admin