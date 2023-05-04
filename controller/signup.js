const express=require('express')
const Joi=require('joi')

module.exports=(user)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        mobile:Joi.number().required(),
        email:Joi.string(),
        password:Joi.string().required(),
        city:Joi.string(),
        country:Joi.string(),
        address:Joi.string(),
        role:Joi.string().required()
    })
    return schema.validate(user)
}