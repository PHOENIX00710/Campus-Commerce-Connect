import { conn } from './feedback.js';

export {conn} from '../dataBase/dbConnect.js';

export const giveFeedback=(req,res)=>{
    const feedback=req.body;
    console.log(feedback);
    const currentUser=req.cookies.token;
    const expandedDate=new Date();
    const just_date=expandedDate.toISOString().split('T')[0];
    let feed_id=0;
    let adminID;
    let sql=`SELECT max(feed_id) as f_id from feedback`;
    conn.query(sql,(err,result)=>{
        if(err)
            res.send("<h1>Error!!</h1>");
        if(result[0].f_id != null)
            feed_id=Number(result[0].f_id)+1;
        sql=`SELECT A.admin_id, MIN(F.feed_id) AS min_feed_id, COUNT(F.feed_id) AS feedback_count
        FROM admins A
        JOIN feedback F ON A.admin_id = F.admin_id
        GROUP BY A.admin_id
        ORDER BY feedback_count
        LIMIT 1`;
        conn.query(sql,(error,result1)=>{
            if(error)
                res.send("<h1>Error!!</h1>");
            console.log("Hello query 2!");
            if(result1.length == 0)
                adminID=123;
            adminID=result1[0].admin_id;
            console.log(feed_id,just_date,currentUser,adminID);
            let sql2=`INSERT INTO FEEDBACK VALUES('${feed_id}','${just_date}',0,'${feedback.feedbackDescription}','${currentUser}','${feedback.productID}',${adminID})`;
            conn.query(sql2,(error2,result2)=>{
                if(error2){
                    console.log(error2);
                    res.render("feedback",{message:"Error in submitting Feedback!!"});
                }
                res.render("feedback",{success:"Feedback has been submitted!!"});
            })
        })
    })
}