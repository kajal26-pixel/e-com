const express=require('express')
const app=express()
const mongoose=require('mongoose')
require('dotenv').config()
const swaggerui=require('swagger-ui-express')
const swaggeroutput=require('./swagger-output.json')
const routes=require('./routes/index')
var cors = require('cors')
const bodyParser=require('body-parser')
//const path = require('path')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(cors());
app.use(express.json());
app.use('/doc',swaggerui.serve,swaggerui.setup(swaggeroutput))

app.use('/',routes.commonroute)
app.use('/',routes.admin)
app.use('/',routes.business)
app.use('/',routes.customer)
app.use('/',routes.stripe)


const path = require('path')
const request = require('request');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//app.use(express.static('public'));
//app.use(bodyParser.urlencoded({extended: true}));
// app.set ('view engine', 'ejs') 
// app.get('/', function (req, res) {
//     res.render('index');
// });
// app.post('/captcha', function(req, res) {
//     if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
//     {
//       return res.json({"responseError" : "something goes to wrong"});
//     }
//     const secretKey = "6Le3zLclAAAAAADh5lrjQsLrUit_Crhz6bgU-r0O";
//     const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
 
//     request(verificationURL,function(error,response,body) {
//     body = JSON.parse(body);
 
//     if(body.success !== undefined && !body.success) {
//       return res.json({"responseError" : "Failed captcha verification"});
//     }
//     res.json({"responseSuccess" : "Sucess"});
//   });
// });







mongoose.connect(process.env.DB)
.then(console.log('mongodb conected'))
.catch(err=>console.log(err))

const port=3000
app.listen(port,()=>{console.log('listening on port'+port+'...')})