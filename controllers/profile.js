import {conn} from '../dataBase/dbConnect.js';

export const getProfileDetails = (req, res) => {
    let currentUser=req.cookies.token;
    console.log(currentUser);
    let sql = `SELECT distinct f_name,l_name,email,phone_number,(select count(p_id) from products where buyer_id='${currentUser}') as products_bought,(select count(p_id) from products where seller_id='${currentUser}' and buyer_id is null) as products_onSale,(select count(p_id) from products where seller_id='${currentUser}' and buyer_id is not null) as products_sold
    FROM users,products 
    WHERE users.username=products.seller_id and users.username='${currentUser}'`;
    let userDetails={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.json({error:"<h1>Error!</h1>"});
        userDetails=result[0];
        res.json({
            userDetails,
        })
    })
};

export const getMyOrders=(req,res)=>{
    let currentUser=req.cookies.token;
    let sql = `SELECT f_name as seller_fname,l_name as seller_lname,email as seller_email,
                p_id,p_name,bought_date
                FROM users,products 
                WHERE users.username=products.buyer_id and users.username='${currentUser}'`;
    let products={};
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send("<h1>Error</h1>");
        products=result;
        res.json({
            products,
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
        res.json({
            products,
        })
    })
};

export const handleRequests=(req,res)=>{
    const prod_id=req.params.id1;
    const buyerID=req.params.id2;
    const currentUser=req.cookies.token;
    let expandedDate=new Date();
    let date=expandedDate.toISOString().split('T')[0];
    let sql=`update products set buyer_id='${buyerID}',bought_date='${date}' where p_id='${prod_id}';`
    conn.query(sql,(err,result)=>{
        if(err)
            return res.render("approval",{message:"Error in Handling Request"});
        res.render("approval",{message:"Request Handled"});
    })
};

export const getRequests=(req,res)=>{
    const currentUser=req.cookies.token;
    let requests={};
    console.log("Hello!!");
    let sql=`SELECT u.username as buyer_id,u.f_name as buyer_fname,u.l_name as buyer_lname,u.email as buyer_email, u.phone_number as buyer_phoneNumber, p.p_name as p_name, p.p_id as p_id
    from products as p, requests as r, users as u 
    where r.p_id=p.p_id and r.buyer_id=u.username and p.seller_id='${currentUser}'`;
    conn.query(sql,(err,result)=>{
        if(err)
            return res.json({error:"<h1>Error!</h1>"});
        requests=result;
        res.json({
            "success":true,
            requests,
        })
    })
};