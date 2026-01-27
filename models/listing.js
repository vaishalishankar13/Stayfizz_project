const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review=require("./review.js")
const User=require("./user.js")

const listingSchema = new Schema({
  title: {
    type:String, 
   required:true},// String is shorthand for {type: String}
  description:{
    type:String,
    required:true},
    image:{
      url:String,
      filename:String
    },
 price:Number,
  location:String,
  country:String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});
listingSchema.post("findOneAndDelete",async(listingData)=>{
  if(listingData){
    await Review.deleteMany({_id:{$in:listingData.reviews}})
  }
  console.log("with listing, reviews also deleted")

})
const Listing= mongoose.model('Listing', listingSchema);

module.exports = Listing;

