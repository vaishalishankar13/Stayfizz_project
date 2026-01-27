const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const Review= require('../models/review.js');
const Listing= require('../models/listing');
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listings")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

//index route
//create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))
// .post(upload.single('listing[image]'), function (req, res) {
//   res.send(req.file)
//   // req.body will hold the text fields, if there were any
// })

//rendernewform
router.get("/new",isLoggedin,listingController.renderNewForm)

//update listing info
//to delete listing
router.route("/:id")
.get(wrapAsync(listingController.showOneListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing))


//edit display form
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm))









module.exports=router