const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const User= require('../models/user.js');
const passport=require("passport");
const { saveRedirecturl } = require('../middleware.js');
const userController=require("../controllers/users.js")

//router.use(express.urlencoded());
router.route("/signup")
.get(wrapAsync(userController.getSignup))
.post(wrapAsync(userController.postSignup))

router.route("/login")
.get(userController.getLogin)
.post(saveRedirecturl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.postLogin)

router.get("/logout",userController.logout)



// router.post("/login", async (req, res, next) => {
//     console.log("--- Login Request Received ---");

//     try {
//         // 1. Manual Database Check (Confirming the user exists in MongoDB)
//         const testUser = await User.findOne({ username: req.body.username });
//         console.log("Database lookup test:", testUser ? `User '${req.body.username}' found` : "User not found");

//         console.log("Attempting Passport Authentication...");
        
//         // 2. Passport custom callback logic
//         passport.authenticate("local", (err, user, info) => {
//             console.log("PASSPORT CALLBACK REACHED!"); 

//             // Handle system errors (like database connection issues)
//             if (err) {
//                 console.log("Passport System Error:", err);
//                 return next(err);
//             }

//             // Handle Authentication Failures (Wrong password, wrong username)
//             if (!user) {
//                 // If info is undefined, provide a fallback message
//                 const failureMessage = info ? info.message : "Invalid username or password";
//                 console.log("Authentication Failed:", failureMessage);
                
//                 req.flash("error", failureMessage);
//                 return res.redirect("/login");
//             }

//             // 3. Log the user in manually (required when using a custom callback)
//             req.logIn(user, (err) => {
//                 if (err) {
//                     console.log("Login Session Error:", err);
//                     return next(err);
//                 }
                
//                 console.log("Login Successful for user:", user.username);
//                 req.flash("success", "Welcome back to Wanderlust!");
//                 res.redirect("/listings");
//             });
//         })(req, res, next);

//     } catch (e) {
//         console.log("CRITICAL ROUTE ERROR:", e);
//         next(e);
//     }
// });
module.exports=router;