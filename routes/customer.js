const express=require('express')
const router=express.Router()
const Model=require('../models/index')
const controller=require('../controller/index')
const middleware=require('../middleware/index')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const bodyParser=require('body-parser')
require('dotenv').config()
//const stripe=require('stripe')(process.env.STRIPE_KEY)
const Razorpay=require('razorpay')
const path=require('path')
const products = require('../models/products')

router.use(express.json())
router.use(express.urlencoded({extended:false}))

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())




router.get('/getallproducts',middleware.customer.customer,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const result=[]
        const wow=await Model.category.find()
        for(let i of wow){
            if(i.description.color!=undefined){
                result.push(i)
            }
        }
        res.send(result)
    }
    catch(err){
        res.send(err)
    }
    
})

router.get('/getproduct/:id',middleware.customer.customer,async(req,res)=>{
     try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const pro=await Model.category.findOne({_id:req.params.id})
        res.send(pro)
     }
     catch(err){
        res.send(err)
     }
   
})

router.post('/tocart/:productid',middleware.customer.customer,async(req,res)=>{
    try{
        /* #swagger.parameters['auth'] = {
            in: 'header',
            description: 'auth'
        } */
        const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
        console.log(tok.id)
        const user=await Model.cart.findOne({userId:tok.id})
        if(user){
           // if(await Model.cart.findOne({productsproductId:req.params.productid}))
           // {res.send('yess')}
            await Model.cart.findByIdAndUpdate(user.id,
            user.products.push({productId:req.params.productid}))
            user.save()
            res.send('added')
            return;
        }
        const pro=await Model.category.findOne({_id:req.params.productid})
        //console.log(pro)
        const cart=new Model.cart({
            userId:tok.id
        })
        cart.products.push({productId:pro._id})
        //pro.addtocart=true
        cart.save()
        //console.log(cart)
        res.send(cart)
    } 
    catch(err){
        res.send(err)
    }   
})

router.get('/mycart',middleware.customer.customer,async(req,res)=>{
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    const products=await Model.cart.findOne({userId:tok.id}).populate('products.productId').select('products')
    res.send(products)

})

router.post('/createorder',middleware.customer.customer,async(req,res)=>{
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    const cart=await Model.cart.findOne({userId:tok.id})
    const product=await Model.cart.find({userId:tok.id}).populate('products.productId').select('products')
    //console.log(product)
    //console.log(product[0].products)
    var ab=product[0].products
    //ab.push(product.products)
    var amount=0
    for(let i of ab){
        let j =i.productId.description.price
        //console.log()
        amount=amount+j
    }
    const order=new Model.order({
        cart:cart.id,
        amount:amount,
        address:req.body.address
    })
    order.save()
    //const view=await Model.order.findOne({_id:order.id}).populate('cart') 
    res.send(order)
})

router.get('/myorder',middleware.customer.customer,async(req,res)=>{
    const tok=jwt.verify(req.headers.auth,process.env.JWTSECRET)
    const result=await Model.cart.findOne({userId:tok.id}) 
    const order=await Model.order.findOne({cart:result.id}).populate('cart')
    //result.id //.populate('products._id')
    res.send(order)
})
   
router.get('/pay',(req,res)=>{
    res.sendFile('standard.html', { root: path.join(__dirname, '../public') });
})

router.post('/payment',async(req,res)=>{
    try{
    var instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });
    console.log(process.env.KEY_ID)
    console.log(process.env.KEY_SECRET)
    if(instance){console.log('hi')}

    const amt=await Model.order.findOne({_id:req.body.orderid})
    console.log(amt)
    console.log((amt.amount)*100)
    // var options={
    //     amount:"20000",//(amt.amount)*100,  // amount in the smallest currency unit
    //     currency: "INR",
    //     receipt: "rcp1"

    // }
    // instance.orders.create(options, function(err, order) {
    //     console.log(order);
    //       });
    const newAmount = (amt.amount)*100
    var order = await instance.orders.create({
        amount:14500,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    });

    console.log(order)

    console.log(order.amount)
    res.status(200).json({
        success:true,
        order,
        amount:order.amount
       // amount:req.body.amount
    })
}
catch(err){
    res.send(err)
}
})

// var settings = {
//     "url": "/api/payment/verify",
//     "method": "POST",
//     "timeout": 0,
//     "headers": {
//         "Content-Type": "application/json"
//     }
// }

// router.post("/api/payment/verify",(req,res)=>{

//     let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
//      var crypto = require("crypto");
//      var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
//                                      .update(body.toString())
//                                      .digest('hex');
//                                      console.log("sig received " ,req.body.response.razorpay_signature);
//                                      console.log("sig generated " ,expectedSignature);
//      var response = {"signatureIsValid":"false"}
//      if(expectedSignature === req.body.response.razorpay_signature)
//       response={"signatureIsValid":"true"}
//          res.send(response);
//      });
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjY3ZjIxNmYzYzA5OWFlOWEwZTEzZiIsImlhdCI6MTY4MjMxNjUyOX0.wYgwHglaKJpk1an1qPuWsVn4vXCcEXxU4ewa-8KXuYI
module.exports=router