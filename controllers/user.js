import { log } from 'console';
import { conn } from '../dataBase/dbConnect.js';
import path from 'path';
let currUser = -1;

export const registerUser = (req, res) => {
    const user = req.body;
    const userIdToCheck = user.username.toString();

    // Call the stored procedure
    conn.query('CALL checkUserIdProcedure(?, @isExists)', [userIdToCheck], (error, results) => {
        if (error) {
            throw error;
        }

        // Fetch the output parameter value
        conn.query('SELECT @isExists as isExists', (error, results) => {
            if (error) {
                throw error;
            }
            const isExists = results[0].isExists;
            if (isExists != 0)
                return res.render("register", { message: "Username Already Exists!!" });

            // If Username doesn't exist

            if (user.confirmPassword != user.password) {
                return res.render("register", { message: "The passwords do not match !!" });
            }
            console.log(user,user.f_name,user.l_name);
            let sql = `INSERT INTO users VALUES ('${user.username}','${user.f_name}','${user.l_name}','${user.email}','${user.password}','${user.phone}')`;
            conn.query(sql, (err, result) => {
                if (err)
                    return res.send('<h1>Error in adding User</h1>');
                res.render('register', { success: "Registered Successfully !!" });
            })
        });
    });
};

export const updatePassword = (req, res) => {
    const { username, email, newPassword, confirmPassword } = req.body;
    let sql = `SELECT username from users where email='${email}' and username='${username}'`;
    conn.query(sql, (err, result) => {
        if (err)
            return res.send('<h1>Error</h1>');
        if (result.length === 0)
            return res.render("resetPassword", { message: "User Not Found!!" });
        if (newPassword != confirmPassword) {
            return res.render("resetPassword", { message: "Passwords do not Match!!" });
        }
        sql = `UPDATE users SET password='${newPassword}' where username='${username}'`;
        conn.query(sql, (err, result) => {
            if (err)
                return res.render("resetPassword", { message: "Error in resetting Try Again!!" });
        })
        res.render("resetPassword", { success: "Password has been reset Kindly Login!!" });
    })
};

export const loginConfirmation = (req, res) => {
    const { username, password } = req.body;
    let sql = `SELECT username FROM users WHERE username='${username}' and password='${password}'`;
    conn.query(sql, (error, result) => {
        if (error)
            return res.send("<h1>Error</h1>");
        if (result.length === 0)
            return res.render("login", { message: "Invalid username or password" });
        currUser = result[0].username;
        console.log(currUser);
        res
            .cookie("token", currUser.toString(), { maxAge: 1000 * 60 * 15, httpOnly: true })
            .redirect("/home")
    })
};

export const logOut = (req, res, next) => {
    console.log("Hello");
    res.clearCookie("token");
    next();
}

export { currUser };