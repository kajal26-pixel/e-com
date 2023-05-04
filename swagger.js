const swaggerauto=require('swagger-autogen')

const input=['./routes/admin','./routes/business','./routes/customer','./routes/commonroute']
const output='./swagger-output.json'

const doc={
    definitions:{
        "User":{
            "name":"kajal",
            "email":"sekhrika@gmail.com",
            "password":"87654",
            "mobile":"765479",
            "city":"ambala",
            "country":"India",
            "address":"400,sukhna path",
            "role":"Customer/Admin/Business"
        },
        "Product":{
            "name":"plain white t-shirt",
            "price":"12",
            "description":"comfy cotton wear suitable for summers",
            "color":"white",
            "reviews":"very cool",
            "category":"t-shirts",
            "addtocart":"yes",
            "payment":"Card/Cash/Netbanking"

        },
        "Category":{
            "name":"puma top",
            "parentId":"abcd123",
            "description":{
                "color":"blue",
                "price":"15",
                "size":"L",
                "brand":"puma",
                "camera":"12MP",
                "ram":"4 GB",
                "capacity":"5000 mAh",
                "resolution":"4K",
                "screensize":"55 inch",
                "type":"split"
            },
            "addedby":"654321ab",
            "addtocart":"false"
        }
    }
}

swaggerauto(output,input,doc).then(()=>{
    require('./index.js')
})