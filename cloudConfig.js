const cloudinary = require('cloudinary').v2;
const multerStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage = new multerStorage.CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stayfrizz_DEV',
    allowedFormats: ["jpg" ,"png" ,"jpeg"], // supports promises as well
  },
});
 
module.exports={
    cloudinary,storage
}