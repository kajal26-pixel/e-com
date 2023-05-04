const express=require('express')
const router=express.Router()
const Model=require('../models/index')
const controller=require('../controller/index')
const middleware=require('../middleware/index')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const slugify=require('slugify')
require('dotenv').config()

router.use(express.json())

router.get('/myproducts',middleware.business.business,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
        const product=await Model.category.find({addedby:tok.id})
        console.log(product)
        res.send(product)
    }
    catch(err){
        res.send(err)
    }
})

router.post('/addproduct/:category',middleware.business.business,async(req,res)=>{
    /* #swagger.parameters['category'] = {
        in: 'body',
        description: 'add product',
        schema: { $ref: "#/definitions/Category" }
    } */
    /* #swagger.parameters['auth'] = {
        in: 'header',
        description: 'auth'
    } */
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    const cat=req.params.category
    const result=await Model.category.findOne({name:cat})
    console.log(result)
    if(result){
        const ab=result._id
        if(!req.body.description){res.send('describe your product')}
        const add=new Model.category({
            name:req.body.name,
            slug:slugify(req.body.name),
            description:req.body.description,
            parentId:ab,
            addedby:tok.id
        })
        add.save()
        res.send(add)
    }
    else{
        res.send('category does not exist')
    }
})

module.exports=router