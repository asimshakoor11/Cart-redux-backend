require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51PG1tYJAAxwzjlgZ8vRTNPPWoSxToyPoV5ZZocmUwFYP4wH7wOLYFc1WICyQUyERlmN5C8xC7b3dxj5HSkovdS9s00D1MY9se6");

app.use(express.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","https://food-frontend-sand.vercel.app");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  
  app.use(cors(
    {
      origin: ["https://food-frontend-sand.vercel.app"],
      methods: ["POST", "GET"],
      credentials: true
    }
  ))

// checkout api
app.post("/api/create-checkout-session",async(req,res)=>{
    console.log("hittted")
    const {products} = req.body;

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"pkr",
            product_data:{
                name:product.dish,
                images:[product.imgdata]
            },
            unit_amount:product.price * 100,
        },
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel",
    });

    res.json({id:session.id})
 
})
port= 7000

app.listen(port,()=>{
    console.log("server start at" + port)
})