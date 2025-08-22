const listing = require("./models/listing");
const review = require("./models/review");
module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;

  // Use capitalized model name for clarity
  let foundListing = await listing.findById(id);

  if (!foundListing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewID} = req.params;

  let Review = await review.findById( reviewID);
  if (!Review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this reviews");
    return res.redirect(`/listings/${id}`);
  }
  next();
}