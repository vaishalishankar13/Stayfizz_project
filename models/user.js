const mongoose = require('mongoose');
const { Schema } = mongoose;

const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const userSchema = new Schema({
  email:{
     type:String,
     required:true
  } ,
  
});
console.log("Plugin type:", typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User', userSchema);


