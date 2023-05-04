const mongoose=require('mongoose')

const category=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    slug:{type:String,required:true},
    parentId:{type:String},
    description:{
        color:{type:String},
        price:{type:Number},
        size:{type:String},
        brand:{type:String},
        camera:{type:String},
        ram:{type:String},
        capacity:{type:String},
        resolution:{type:String},
        screensize:{type:String},
        type:{type:String}
    },
    addedby:{type:String},
    addtocart:{type:Boolean}
},{timestamps:true})

module.exports=mongoose.model('category',category)