import {conn} from '../dataBase/dbConnect.js';

export const getProfileDetails = (req, res) => {
    let currentUser=req.cookies.token;
    let sql = `SELECT f_name,l_name,email,phone_number,count(p_id) products_sold
                FROM users,products 
                WHERE users.username=products.seller_id and users.username='${currentUser}' and products.bought_date is not null`;
    let userDetails={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send("<h1>Error</h1>");
        userDetails=result[0];
        console.log(userDetails);
        res.json({
            userDetails,
        })
    })
};

export const getMyOrders=(req,res)=>{
    let currentUser=req.cookies.token;
    let sql = `SELECT f_name,l_name,email,phone_number,count(p_id) products_sold
                FROM users,products 
                WHERE users.username=products.seller_id and users.username='${currentUser}' and products.bought_date is not null`;
    let userDetails={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send("<h1>Error</h1>");
        userDetails=result[0];
        console.log(userDetails);
        res.json({
            userDetails,
        })
    })
};

export const getMyProducts=(req,res)=>{
    let currentUser=req.cookies.token;
    console.log(currentUser);
    let sql = `SELECT *
                FROM products 
                WHERE products.seller_id='${currentUser}' and products.bought_date is null`;
    let products={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send("<h1>Error</h1>");
        products=result;
        console.log(products);
        res.json({
            products,
        })
    })
};

export const getNotifications=(req,res)=>{
    let currentUser=req.cookies.token;
    let sql = `SELECT f_name,l_name,email,phone_number,count(p_id) products_sold
                FROM users,products 
                WHERE users.username=products.seller_id and users.username='${currentUser}' and products.bought_date is not null`;
    let userDetails={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send("<h1>Error</h1>");
        userDetails=result[0];
        console.log(userDetails);
        res.json({
            userDetails,
        })
    })
}