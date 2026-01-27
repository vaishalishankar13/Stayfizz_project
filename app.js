if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
console.log(process.env)


const express=require("express")
const app=express()
const path=require("path")
app.set('view engine', 'ejs')
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js")
app.engine('ejs', ejsMate);
const port=8080;
app.use(express.urlencoded({extended:true}));
const Listing= require('./models/listing');
const listingRouter=require("./routes/listings.js")
const reviewRouter=require("./routes/reviews.js")
const userRouter=require("./routes/users.js")
const mongoose = require('mongoose');
app.set("views", path.join(__dirname, "views"));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy=require("passport-local").Strategy; 
const User=require("./models/user.js")
console.log("Does User.authenticate exist?", typeof User.authenticate === 'function');
const db_url=process.env.ATLASDB_URL
const MongoStore = require("connect-mongo").default;


main().then(()=>console.log("connected to database"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);

//   use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.listen(port,()=>{
    console.log("app is listening to port 8080")
})
const store=new MongoStore({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600

})
store.on("error",()=>{
    console.log("ERROR in mongo session store",err)
})
app.use(session({
    store,
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { 
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
   }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        console.log("Passport is searching for user:", username);
        const { user } = await User.authenticate()(username, password);
        if (!user) {
            console.log("Passport found no user.");
            return done(null, false, { message: "Invalid username or password" });
        }
        console.log("Passport found user and password matched!");
        return done(null, user);
    } catch (e) {
        console.log("Internal Passport Error:", e);
        return done(e);
    }
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
     res.locals.error=req.flash("error")
     res.locals.currUser=req.user;
    next();
})

app.get("/testflash", (req, res) => {
    req.flash("error", "Testing Flash Message");
    res.redirect("/login");
});
app.use("/",userRouter)
app.use("/listings",listingRouter)
//review listing
//post request
app.use("/listings/:id/reviews",reviewRouter)



app.get("/demouser",async(req,res)=>{
    let newuser=new User({
        email:"vaishali@gmail.com",
        username:"vaishali"
    })
    let requser=await User.register(newuser,"helloworld1")
    res.send(requser)
})
app.get("/changedata",async(req,res)=>{
    await Listing.updateMany(
    { }, // 1. Filter: Empty object means "select all documents"
    { $set: { owner:"6959660b1d6d0fddfcf5cbfc" } } // 2. Update: The field to add/change
   
);
 res.send("data updated successfully")
})
// app.get("/",(req,res)=>{
//     res.send("root page is working")
//     console.log(User)
// })
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err
    res.status(statusCode).render("error.ejs",{message})
})

// app.get("/testlisting",async(req,res)=>{
//     let testlist=new Listing({
//         title:"New villa",
//         desciption:"Nice place to visit",
//         price:1200,
//         location:"Manipal",
//         country:"India"

//     })
//     await testlist.save();
//     res.send("saved")
//     console.log("things worked from our end");
// })
