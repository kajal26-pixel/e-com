const jwt=require('jsonwebtoken')
const Model=require('../models/index')
require('dotenv').config()

const customer=async(req,res,next)=>{
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    console.log(tok)
    let ress=await Model.user.findOne({_id:tok.id})
    console.log(ress)
    if(ress.role=='Customer'){
        next()

    }else{
        res.send('not eligible')
    }

}

exports.customer=customer