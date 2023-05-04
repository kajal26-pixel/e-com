const express=require('express')
const router=express.Router()
const Model=require('../models/index')
const controller=require('../controller/index')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()

router.get('/category/list',async(req,res)=>{
    try{
        var ab=await Model.category.find()
        if(ab){
            //console.log(ab)
            const list=controller.category.createcate(ab)
            res.send(list)
        }
    }
    catch(err){
        res.send(err)
    }   
})

router.get('/category/:subcategory',async(req,res)=>{
    const cat=await Model.category.findOne({name:req.params.subcategory})
    const cate=await Model.category.find()
    //console.log(cat)
    if(!cat){res.send('category not found...look into category list for the available categories')}
    var result=controller.category.sublisting(cat,cate)
    res.send(result)
})

router.get('/onecategory/:searchbyid',async(req,res)=>{
    const ab=await Model.category.findById(req.params.searchbyid)
    res.send(ab)
})

router.get('/manycategory/:search',async(req,res)=>{
    try{
        var result=[]
        var ab=await Model.category.find()
        if(ab){
            for(let i of ab){
                if (i.name.includes(req.params.search)==true && i.description.color!=undefined){
                    // console.log(Object.keys(i.description).length) 
                    result.push(i)      
                }
            }
            res.send(result)
        }
    }
    catch(err){
        res.send(err)
    }
})

router.post('/signup',async(req,res)=>{
    /* #swagger.parameters['newUser'] = {
            in: 'body',
            description: 'REGISTER',
            schema: { $ref: "#/definitions/User" }
    } */
    console.log(req.body)
    const result=controller.signup(req.body)
    if(result.error){res.send(result.error.details[0].message)}

    const user=await Model.user.findOne({email:req.body.email})
    if(user){
        res.send('user already registered')
    }

    const entry=new Model.user(req.body)
    const salt=await bcrypt.genSalt(10)
    entry.password=await bcrypt.hash(entry.password,salt)
    await entry.save()
    res.send(entry)
})

router.post('/login',async(req,res)=>{
    /* #swagger.parameters['login'] = {
            in: 'body',
            description: 'login'
    } */
    const result=controller.login(req.body)
    if(result.error){res.send(result.error.details[0].message)}

    const user=await Model.user.findOne({email:req.body.email})
    if(!user){
        res.send('wrong email')
    }

    const pass=await bcrypt.compare(req.body.password,user.password)
    if(!pass){ res.send('wrong password')}

    
    let token=jwt.sign({id:user._id},process.env.JWTSECRET)
    if(pass){
        req.body.password=user.password
        res.json({
            name:user.name,
            email:user.email,
            password:user.password,
            mobile:user.mobile,
            role:user.role,
            password:user.password,
            city:user.city,
            country:user.country,
            address:user.address,
            token:token,
        })
    }
})

router.post('/forgotpw',async(req,res)=>{
    try{
        /* #swagger.parameters['forgot'] = {
               in: 'body',
               description: 'FORGOT',
        }  */
        let result=await Model.user.findOne({email:req.body.email})
        if(!result) return res.status(400).send('invalid email')

        let gotp= await controller.forgot.genotp()
        console.log(gotp)
        let send= await controller.forgot.mail(req.body.email,gotp)
        result.otp=gotp
        console.log(result.otp)
        await result.save()
        var token=jwt.sign({id:result._id},process.env.JWTSECRET)
        if (send) console.log('mail sent')
        res.json({
            token:token,
            otp:gotp,
            email:req.body.email
        })
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

router.post('/forgotpw/verifyotp',async(req,res)=>{
    /* #swagger.parameters['otp'] = {
            in: 'body',
            description: 'OTP',
    }  */
    let result=jwt.verify(req.headers.authorization,process.env.JWTSECRET)
    console.log(result)
    
    req.userdata=result
    console.log(req.userdata)
    
    let ress=await Model.user.findOne({_id:req.userdata.id})
    console.log(ress.otp)
    let timediff=Math.floor((Date.now()-Date.parse(ress.updatedAt))/60000)
    console.log(timediff)
    if(timediff>1){
        return res.status(404).send('your otp has been expired')
    }
    else{
        let otp=String(req.body.otp)
        console.log(otp)
        if(ress.otp==otp) {
            console.log('you are allowed to change password')
            res.send('you are allowed to change password')
        }
        else{
            res.send('wrong otp')
        }
    }
})

router.post('/forgotpw/resetpw',async(req,res)=>{
    /* #swagger.parameters['reset'] = {
            in: 'body',
            description: 'RESET',
    }  */
    
    let token=req.headers.authorization
    let user=jwt.verify(token,process.env.JWTSECRET)
    console.log(user)

    let users=await Model.user.findOne({_id:user.id})
    console.log(users)
    //console.log(users.password)
    //console.log(req.body.password)
    let ab=req.body.password
    let salt=await bcrypt.genSalt(10)
    let cd=await bcrypt.hash(ab,salt)
    users.password=cd
    await users.save()
    res.send('password changed')
})

module.exports=router