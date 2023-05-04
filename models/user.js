const mongoose=require('mongoose')

const types=['Admin','Business','Customer']
//const payment=['Card','Cash','Netbanking','Upi']

const schema=new mongoose.Schema({
    name:{type:String,required:true},
    mobile:{type:Number,required:true},
    email:{type:String},
    password:{type:String,required:true},
    city:{type:String,required:true},
    country:{type:String,required:true},
    address:{type:String,required:true},
    role:types,
    otp:{type:Number,maxlength:4}
},{timestamps:true})
module.exports=mongoose.model('User',schema)