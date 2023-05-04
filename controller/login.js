const express=require('express')
const Joi=require('joi')

module.exports=(user)=>{
    const schema=Joi.object({
        email:Joi.string(),
        password:Joi.string().required()
    })
    return schema.validate(user)
}