require('dotenv').config()
const router=require('express').Router()
const stripe=require('stripe')(process.env.STRIPE_KEY)

router.get('/', function(req, res){
    res.render('payment', {
       key: process.env.STRIPE_PUBLIC_KEY
    })
})

router.post('/paymentstripe',(req,res)=>{
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        
    })
    .then((customer) => {
       return stripe.charges.create({
          amount: 2500,     // Charging Rs 25
          description: 'e-commerce products',
          currency: 'INR',
          customer: customer.id
        });
    })
    .then((charge) => {
            res.send("Success")  // If no error occurs
    })
    .catch((err) => {
            res.send(err)       // If some error occurs
    });
})
    


module.exports=router