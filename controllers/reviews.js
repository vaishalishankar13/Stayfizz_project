const Listing=require("../models/listing")
const Review=require("../models/review")

//createReview
module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    let newrev=new Review(req.body.review)
    newrev.author=req.user._id
   listing.reviews.push(newrev)
 //console.log(currUser)
    await newrev.save()
   await listing.save()
  console.log(req.body.review)
  req.flash('success', 'New review added')
  res.redirect(`/listings/${id}`)
}

//destroy review
module.exports.destroyReview=async(req,res)=>{
    let {id, reviewId}=req.params;
    let listing=Listing.findById(id)
    await Listing.findByIdAndUpdate(id,{$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted')
    res.redirect(`/listings/${id}`)
}