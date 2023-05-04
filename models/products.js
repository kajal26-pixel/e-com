const mongoose=require('mongoose')
//const types=['Admin','Business','Customer']
const payment=['Card','Cash','Netbanking','Upi']
const category=['Clothing','Bags','Footwear','Makeup','Accessories','Home Appliances']

const schema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String},
    color:{type:String,required:true},
    reviews:{type:String},
    category:category,
    addtocart:{type:Boolean,default:false},
    payment:payment,
    addedby:{type:String,required:true}
    
})
module.exports=mongoose.model('Products',schema)