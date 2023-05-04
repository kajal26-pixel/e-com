const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema(
    {
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    products:[
        {
        
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
            quantity:{type:Number,default:1}
        
        }
    ]
    },
    {timestamps:true}
)

module.exports=mongoose.model('cart',cartSchema)