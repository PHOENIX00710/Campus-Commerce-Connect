import { conn } from '../dataBase/dbConnect.js';

export const getAllUsers=(req,res)=>{
    let users={};
    let sql='SELECT * FROM USERS';
    conn.query(sql,(err,result)=>{
        if(err)
            res.json({error:"Error!!"});
        users=result;
        res.json({
            success:true,
            users,
        })
    })
};

export const getAllFeedbacks=(req,res)=>{
    let sql='SELECT distinct f1.feed_id,f1.feed_date,f1.feed_desc,f1.p_id,f1.user_id as buyer_id, p1.seller_id FROM feedback f1 join products p1 on p1.p_id=f1.p_id';
    let feedbacks={};
    conn.query(sql,(err,result)=>{
        if(err)
            res.json({error:"Error!!"});
        feedbacks=result;
        res.json({
            success:true,
            feedbacks
        })
    })
}

export const deleteUser=(req,res)=>{
    let username=req.params.id;
    let sql=`DELETE FROM USERS where username='${username}'`;
    conn.query(sql,(err,result)=>{
        if(err){
            res.json({
                success:false,
            })
        }
        res.json({
            success:true,
        })
    })
};

export const handleDiscount=(req,res)=>{
    let discounts=req.body;
    let sql;
    console.log(discounts);
    if(discounts.increasePrice === '1'){
        sql=`CALL reverseDiscount(${Number(discounts.percent)/100},${Number(discounts.threshold)}) `;
    }
    else if(discounts.decreasePrice === '1'){
        sql=`CALL updateProductPricesWithDiscount(${Number(discounts.percent)/100},${Number(discounts.threshold)}) `;
    }
    conn.query(sql,(err,result)=>{
        if(err)
            res.render("discount",{message:"Could not update Amounts"});

        res.render("discount",{success:"Amounts Updated Successfully"});
    })
};


export const adminLoginConfirmation=(req,res)=>{
    const {username,password}=req.body;
    let sql=`SELECT admin_id FROM admins WHERE admin_id='${username}' and admin_password='${password}'`;
    console.log(username,password);
    conn.query(sql,(error,result)=>{
        if(error)
            return res.send("<h1>Error</h1>");
        if(result.length === 0)
            return res.render("admin",{message:"Invalid username or password"});
        let currUser=result[0].admin_id;
        res
        .cookie("token",currUser.toString(),{ maxAge: 1000*60*15, httpOnly: true})
        .redirect("/adminDashboard")
    })
};