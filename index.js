import express from 'express'
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import {conn} from './dataBase/dbConnect.js';
import { logOut, loginConfirmation, registerUser, updatePassword } from './controllers/user.js'
import { getAllProducts, getByCategories, makeRequest, sellProducts, sortByDate, sortByPrice } from './controllers/products.js';
import { authentication } from './middleware/functions.js';
import { getMyOrders, getMyProducts, getNotifications, getProfileDetails, getRequests } from './controllers/profile.js';
import { giveFeedback } from './controllers/feedback.js';

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve()+'/frontend')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://10.86.0.243:5500');
    next();
});
app.set("view engine","ejs");

conn.connect((err)=>{
    if(err)
        return console.error(err);
    console.log("Connected");
})

// REGISTER PAGE

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",registerUser);

// LOGIN PAGE

app.get("/login",(req,res)=>{
   res.render("login");
})

app.post("/login",loginConfirmation);

// RESET PASSWORD

app.get("/resetPassword",(req,res)=>{
   res.render("resetPassword");
})

app.post("/resetPassword",updatePassword);


// Home PAGE
app.get("/home",authentication,(req,res)=>{
    res.sendFile(path.join(path.resolve()+'/frontend/html/home.html'));
})

app.get("/getProducts/:id",authentication,getAllProducts);

app.get("/categories/:id",authentication,getByCategories);

app.get("/sortByDate/:id",authentication,sortByDate);

app.get("/sortByPrice/:id",authentication,sortByPrice);

// Requests in Home page

app.get("/request/:id",authentication,makeRequest);


//SELL PAGE
app.get("/sell",authentication,(req,res)=>{
    res.render("sell");
})

app.post("/sell",sellProducts);

//PROFILE SECTION

app.get("/profile",authentication,(req,res)=>{
    res.sendFile(path.join(path.resolve()+'/frontend/html/profile.html'));
})

app.get("/getProfile",authentication,getProfileDetails);
app.get("/myOrders",authentication,getMyOrders);
app.get("/myProducts",authentication,getMyProducts);
app.get("/notifications",authentication,getRequests);


// FeedBack

app.get("/feedback",(req,res)=>res.render("feedback"));
app.post("/feedback",authentication,giveFeedback);

//LOGOUT
app.get("/logout",(req,res)=>{
    res.render("login");
});

//GENERAL REQUESTS
app.get("/",authentication,(req,res)=>{
    res.redirect('/register');
})

app.listen(3000,()=>{
    console.log("Server is listening at port 3000");
})