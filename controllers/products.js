import { conn } from '../dataBase/dbConnect.js';
var products = {};

export const getAllProducts = (req, res) => {
    const currentUser=req.cookies.token;
    let sql=`SELECT * FROM products where buyer_id is null and seller_id <> '${currentUser}'`;
    conn.query(sql, (err, result) => {
        if (err)
            return res.send("<h1>Error in Fetching Data</h1>");
        products = result;
        res.json({
            "success": true,
            products,
        })
    });
};

export const getByCategories = (req, res) => {
    let param=req.params.id;
    console.log(param);
    const currentUser=req.cookies.token;
    let sql=`SELECT * FROM products where p_category='${param}' and buyer_id is null and seller_id <> '${currentUser}'`
    req.category=null;
    conn.query(sql,(err,result)=>{
        if(err)
            return res.json({"success":false,"message":"Error in sending data"});
        products=result;
        res.json({
            "success":true,
            products,
        })
    })
};

export const sortByDate = (req, res) => {
    const currentUser=req.cookies.token;
    let sql=`SELECT * FROM products where buyer_id is null and seller_id <> '${currentUser}' order by onsale_date DESC`
    conn.query(sql,(err,result)=>{
        console.log(result);
        if(err)
            return res.json({"success":false,"message":"Error in sending data"});
        products=result;
        //console.log(products);
        res.json({
            "success":true,
            products,
        })
    })
};

export const sortByPrice = (req, res) => {
    const currentUser=req.cookies.token;
    let sql=`SELECT * FROM products where buyer_id is null and seller_id <> '${currentUser}' order by p_price DESC`
    conn.query(sql,(err,result)=>{
        console.log(result);
        if(err)
            return res.json({"success":false,"message":"Error in sending data"});
        products=result;
        //console.log(products);
        res.json({
            "success":true,
            products,
        })
    })
};

export const searchByText=(req,res)=>{
    const currentUser=req.cookies.token;
    const searchText=req.params.id;
    let sql=`SELECT * FROM PRODUCTS WHERE buyer_id is null and seller_id <> '${currentUser}' and p_name like '%${searchText}%'`;
    conn.query(sql,(err,result)=>{
        if(err)
            return res.json({"success":false,"message":"Error in sending data"});
        products=result;
        //console.log(products);
        res.json({
            "success":true,
            products,
        })
    })
}

export const sellProducts = async (req, res) => {
    const product = req.body;
    console.log(product);
    let sql = `SELECT p_id FROM products WHERE onsale_date >= ALL (SELECT MAX(onsale_date) FROM products)`;

    // Retrieving user_id,date,and forming new product id.
    let currentUser=req.cookies.token;
    const expandedDate = new Date();
    const date = expandedDate.toISOString().split('T')[0];
    let prod_id;
    conn.query(sql, (err, result) => {
        console.log(sql);
        if (err)
            return res.render("sell", { message: "Could not add items plzz try again!!" });
        let tempString=result[0].p_id.toString().substr(1);
        let tempSequence=Number(tempString)+1;
        prod_id=`P${tempSequence}`;
        // Inserting new Item in the table
        let sql2 = `insert into products values('${prod_id}','${product.productName}','${product.productDescription}','${product.productImage}',${product.productPrice},'${product.CategoryChoices}','${date}',null,'${currentUser}',null)`;

        if (!currentUser)
            return res.render("login", { message: "You were not logged in while adding items" });

        conn.query(sql2, (err, result) => {
            console.log("Second Query", sql, sql2, prod_id);
            if (err) {
                return res.render("sell", { message: "Could not add items plzz try again!!" });
            }
            res.render("sell", { success: "Succes in Adding Item" });
        })
    });
};

export const makeRequest=(req,res)=>{
    const currentUser=req.cookies.token;
    const productID=req.params.id;
    console.log(currentUser,productID);
    let sql=`INSERT INTO REQUESTS VALUES('${currentUser}','${productID}',0)`
    conn.query(sql,(err,result)=>{
        if (err){
            res.json({
                success:false,
                message:"Not inserted"
            })
        }
        res.json({
            success:true,
            message:"Inserted"
        })
    });
}

export const editProductDetails =(req,res)=>{
    const prod_id=req.params.id;
    console.log(prod_id);
    let productDetails={};
    let sql=`SELECT * from products
             where buyer_id is null and p_id='${prod_id}'`;
    conn.query(sql,(err,result)=>{
        if(err){
            res.json({
                success:false,
                message:"Error in Querying"
            })
        }
        productDetails=result[0];
        console.log(productDetails);
        res.render("edit",{productDetails});
    })
};

export const updateProductDetails =(req,res)=>{
    const prod_id=req.params.id;
    console.log(prod_id);
    const product = req.body;
    console.log(product);
    let sql = `UPDATE products set p_name= '${product.productName}',p_desc='${product.productDescription}',p_img='${product.productImage}',p_price='${product.productPrice}',p_category='${product.CategoryChoices}' where p_id= '${prod_id}'`;
    conn.query(sql, (err, result) => {
        if (err)
            res.render("approval",{message:"Error"});
        res.render("approval",{message:"Success"});
    });
};


export const deleteProduct =(req,res)=>{
    const productID=req.params.id;
    console.log(productID);
    let sql=`DELETE FROM products where p_id='${productID}'`;
    console.log(sql);
    conn.query(sql,(err,result)=>{
        if(err)
            res.json({success:false});

        res.json({success:true});
    })
};