const Listing=require("../models/listing")


//index route
module.exports.index=async(req,res)=>{
    console.log("page is working fine")
    //res.send("this is main page")
    let allListing=await Listing.find({})
    res.render("listings/showListings",{allListing})
    //console.log(allListing)
}

module.exports.renderNewForm=(req,res)=>{
res.render("listings/newform.ejs")
}

module.exports.showOneListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"},
    })
    .populate("owner");
    if(listing==null){
        req.flash("error","Listing doesnot exist")
        res.redirect("/listings")
        //console.log(listing)
        }
    
    else{
         res.render("listings/onelisting.ejs",{listing})
    }
    console.log(listing);
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/editform.ejs",{listing})

}

module.exports.createListing=async(req,res,next)=>{
    //let newlisting=req.body.listing;
    let filename=req.file.filename;
    let url=req.file.path
    console.log(filename,"...",url)
    let newlisting=new Listing(req.body.listing)
    console.log(req.body.listing)
    newlisting.owner=req.user._id,
    newlisting.image={url,filename},
    await newlisting.save();
    req.flash('success', 'New listing added')
    console.log("new listing saved to database")
    res.redirect("/listings")

}

module.exports.updateListing=async(req,res)=>{
   let {id}=req.params;
 
   let updated=await Listing.findByIdAndUpdate(id,req.body.listing)
   if(typeof req.file != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename
   updated.image={url,filename}
   await updated.save();
   }
   req.flash('success', 'Listing updated')
   console.log("listing updated")
   res.redirect(`/listings/${id}`)

}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id)
    if(!deletedlisting){
        req.flash("error","Listing doesnot exist")
        res.redirect("/listings")
    }
    else{
         req.flash('success', 'Listing deleted')
    console.log("listing deleted")
    console.log(deletedlisting)
    res.redirect("/listings")
    }
    
}