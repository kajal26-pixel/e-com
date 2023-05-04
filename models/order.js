const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema(
    {
    cart:{type:mongoose.Schema.Types.ObjectId,ref:'cart'},
    amount:{type:Number,required:true},
    address:{type:Object,required:true}
    //status:{type:String,default:"pending"}
},
    {timestamps:true}
)

module.exports=mongoose.model('order',orderSchema)