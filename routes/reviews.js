const express = require('express');

const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js")
const Review= require('../models/review.js');
const Listing= require('../models/listing');
const {validateReview,isLoggedin,isReviewOwner}=require("../middleware.js")
const reviewController=require("../controllers/reviews")



router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview))

//deleting of the reviews
router.delete("/:reviewId",isLoggedin,isReviewOwner,wrapAsync(reviewController.destroyReview))

module.exports=router;