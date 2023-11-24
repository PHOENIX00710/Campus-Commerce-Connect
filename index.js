import express from 'express'
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import {conn} from './dataBase/dbConnect.js';
import { logOut, loginConfirmation, registerUser, updatePassword } from './controllers/user.js'
import { deleteProduct, editProductDetails, getAllProducts, getByCategories, makeRequest, searchByText, sellProducts, sortByDate, sortByPrice, updateProductDetails } from './controllers/products.js';
import { authentication } from './middleware/functions.js';
import { getMyOrders, getMyProducts, getProfileDetails, getRequests, handleRequests } from './controllers/profile.js';
import { giveFeedback } from './controllers/feedback.js';
import {adminLoginConfirmation, deleteUser, getAllFeedbacks, getAllUsers, handleDiscount} from './controllers/admin.js';


const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve()+'/frontend')));
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
app.get("/search/:id",searchByText);

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

//Edit product details
app.post("/edit/:id",authentication,updateProductDetails)
app.get("/edit/:id",authentication,editProductDetails);

//Delete Products
app.get("/delete/:id",authentication,deleteProduct);


// Handle Requests

app.get("/requestConfirmed/:id1/:id2",authentication,handleRequests);

// FeedBack

app.get("/feedback",(req,res)=>res.render("feedback"));
app.post("/feedback",authentication,giveFeedback);

// Admin Requests

app.get("/admin",(req,res)=>{
    res.render("admin");
});
app.post("/adminLogin",adminLoginConfirmation);

//Admin Dashboard
app.get("/adminDashboard",(req,res)=>{
    res.sendFile(path.join(path.resolve()+'/frontend/html/adminDashboard.html'));
})
app.get("/getProducts",authentication,getAllProducts);
app.get("/users",authentication,getAllUsers);
app.get("/feedbacks",authentication,getAllFeedbacks);

    //Delete Users
app.get("/deleteUser/:id",authentication,deleteUser);

   //Discounts
app.get("/modulatePrice",authentication,(req,res)=>{
    res.render("discount");
})
app.post("/discount",authentication,handleDiscount);

//LOGOUT
app.get("/logout",logOut,(req,res)=>{
    return res.render("login");
});

//GENERAL REQUESTS
app.get("/",authentication,(req,res)=>{
    res.redirect('/register');
})

app.listen(3000,()=>{
    console.log("Server is listening at port 3000");
})