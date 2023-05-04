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

router.get('/allbusiness',middleware.admin.admin,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const users=await Model.user.find({role:'Business'})

        console.log(users)
        res.send(users)
    }
    catch(err){
        res.send(err)
    }
})

router.get('/allcustomers',middleware.admin.admin,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const users=await Model.user.find({role:'Customer'})

        console.log(users)
        res.send(users)
    }
    catch(err){
        res.send(err)
    }
})

router.get('/alladmins',middleware.admin.admin,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const users=await Model.user.find({role:'Admin'})

        console.log(users)
        res.send(users)
    }
    catch(err){
        res.send(err)
    }
})

router.post('/category/create',middleware.admin.admin,(req,res)=>{
    /* #swagger.parameters['category'] = {
        in: 'body',
        description: 'add category',
        schema: { $ref: "#/definitions/Category" }
    } */
    /* #swagger.parameters['auth'] = {
        in: 'header',
        description: 'auth'
    } */
    const addcategory={
        name:req.body.name,
        slug:slugify(req.body.name)
    }
    if(req.body.parentId){
        addcategory.parentId=req.body.parentId
    }
    if(req.body.description){
        addcategory.description=req.body.description
    }
    const add=new Model.category(addcategory)
    add.save()

    res.send(add)
})

router.get('/allcarts',middleware.admin.admin,async(req,res)=>{
    const allcarts=await Model.cart.find()
    res.send(allcarts)

})

router.get('/allorders',middleware.admin.admin,async(req,res)=>{
    const allorders=await Model.order.find()
    res.send(allorders)
})

module.exports=router