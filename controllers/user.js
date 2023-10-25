import {conn} from '../dataBase/dbConnect.js';
import path from 'path';
let currUser=-1;

export const registerUser=(req,res)=>{
    const user=req.body;
    let num=Math.floor(Math.random()*50+10);
    if(user.confirmPassword != user.password){
        return res.render("register",{message:"The passwords do not match !!"});
    }
    let sql=`INSERT INTO users VALUES (${num},'${user.username}','${user.email}','${user.password}','${user.phone}')`;
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send('<h1>Error in adding User</h1>');
        res.render('register',{success:"Registered Successfully !!"});
    })
};

export const updatePassword=(req,res)=>{
    const {username,email,newPassword,confirmPassword}=req.body;
    let sql=`SELECT user_id from users where email='${email}' and user_name='${username}'`;
    conn.query(sql,(err,result)=>{
        if(err)
            return res.send('<h1>Error</h1>');
        if(result.length === 0)
            return res.render("resetPassword",{message:"User Not Found!!"});
        if(newPassword != confirmPassword){
            return res.render("resetPassword",{message:"Passwords do not Match!!"});
        }
        sql=`UPDATE users SET password='${newPassword}' where email='${email}'`;
        conn.query(sql,(err,result)=>{
            if(err)
                return res.render("resetPassword",{message:"Error in resetting Try Again!!"});
        })
        res.render("resetPassword",{success:"Password has been reset Kindly Login!!"});
    })
};

export const loginConfirmation=(req,res)=>{
    const {username,password}=req.body;
    let sql=`SELECT user_id FROM users WHERE user_name='${username}' and password='${password}'`;
    conn.query(sql,(error,result)=>{
        if(error)
            return res.send("<h1>Error</h1>");
        if(result.length === 0)
            return res.render("login",{message:"Invalid username or password"});
        currUser=result[0].user_id
        console.log(currUser);
        res
        .cookie("token",currUser.toString(),{ maxAge: 1000*60*5, httpOnly: true})
        .redirect("/home")
    })
};

export const logOut=(req,res,next)=>{
    let currentUser=Number(req.cookies.token);
    if(currentUser){
        res
        .clearCookie("token")
        .render("login");
    }
}

export {currUser};