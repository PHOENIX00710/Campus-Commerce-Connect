import { conn } from '../dataBase/dbConnect.js';
var products = {};

export const getAllProducts = (req, res) => {
    let sql=`SELECT * FROM product`;
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
    let sql=`SELECT * FROM product order by p_price DESC'`
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
    let sql=`SELECT * FROM product order by onsale_date DESC`
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
    let sql=`SELECT * FROM product order by p_price DESC`
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
    let sql = `SELECT max(p_id) as ans FROM product`;

    // Retrieving user_id,date,and forming new product id.
    let currentUser=Number(req.cookies.token);
    const expandedDate = new Date();
    const date = expandedDate.toISOString().split('T')[0];
    let prod_id = 0;
    conn.query(sql, (err, result) => {
        console.log(sql);
        if (err)
            return res.render("sell", { message: "Could not add items plzz try again!!" });
        prod_id = Number(result[0].ans) + 1;
        
        // Inserting new Item in the table
        let sql2 = `INSERT INTO product VALUES ('${prod_id}','${product.productName}',${product.productPrice},'${product.productCategory}',${currentUser},'${date}',null,0,'${product.productImage}','${product.productDescription}')`;

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