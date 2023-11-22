import { conn } from '../dataBase/dbConnect.js';
var products = {};

export const getAllProducts = (req, res) => {
    let sql=`SELECT * FROM products where buyer_id is null`;
    conn.query(sql, (err, result) => {
        if (err)
            return res.send("<h1>Error in Fetching Data</h1>");
        products = result;
        res.json({
            "success": true,
            products,
        })
    })
};

export const getByCategories = (req, res) => {
    let param=req.params.id;
    console.log(param);
    let sql=`SELECT * FROM products where p_category='${param}' and buyer_id is null`
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
    let sql=`SELECT * FROM products where buyer_id is null order by upload_date DESC`
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
    let sql=`SELECT * FROM products where buyer_id is null order by p_price DESC`
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


export const sellProducts = async (req, res) => {
    const product = req.body;
    console.log(product);
    let sql = `SELECT p_id FROM products WHERE upload_date >= ALL (SELECT MAX(upload_date) FROM products)`;

    // Retrieving user_id,date,and forming new product id.
    let currentUser=req.cookies.token;
    const expandedDate = new Date();
    const date = expandedDate.toISOString().split('T')[0];
    let prod_id;
    conn.query(sql, (err, result) => {
        console.log(sql);
        if (err)
            return res.render("sell", { message: "Could not add items plzz try again!!" });
        console.log(result[0]);
        let tempString=result[0].p_id.toString().substr(1);
        console.log(tempString);
        let tempSequence=Number(tempString)+1;
        console.log(tempSequence);
        prod_id=`P${tempSequence}`;
        console.log(prod_id);
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
    let sql=`INSERT INTO REQUESTS VALUES('${currentUser}','${productID}',0)`
    conn.query(sql,(err,result)=>{
        if (err)
            return res.send("<h1>Error!!</h1>");
        res.json({
            success:true,
            message:"Inserted"
        })
    });
}