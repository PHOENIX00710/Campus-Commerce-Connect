export const authentication=(req,res,next)=>{
    let currentUser=req.cookies.token;
    if(!currentUser)
        return res.render("login");
    next();
}