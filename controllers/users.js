const User=require("../models/user")


module.exports.getSignup=async(req,res)=>{
    console.log("page is working fine")
    //res.send("this is main page")
    // let allListing=await Listing.find({})
    // res.render("listings/showListings",{allListing})
    //console.log(allListing)
    console.log("so far things are working fine")
    res.render("users/signup.ejs")
}

module.exports.postSignup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let user1=new User({
        username,
        email
    })
    let reguser=await User.register(user1,password)
    req.logIn(reguser, (err) => { // This is the "Passport, now start the session" part
    if (err) return next(err);
     req.flash("success","user is registered successfully")
    res.redirect("/listings")
})
   
    }catch(e){
        req.flash("error",e.message)
        res.redirect("signup")
    }
}

module.exports.getLogin=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.postLogin=async(req,res)=>{
    req.flash("success", "Welcome back to stayfrizz");
    let redirecturl=res.locals.redirectUrl || "/listings"
    res.redirect(redirecturl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err)
       }
       else{
        req.flash("success","you have been successfully logged off")
        res.redirect("/listings")
       }
    })
}