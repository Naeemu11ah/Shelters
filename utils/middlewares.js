const Listing = require("../models/listings");
const Review = require("../models/reviews");

module.exports.isUserLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.userPrevPage = req.originalUrl;
    req.flash("error", "Please log in to continue!");
    return res.redirect("/login");
  }
  next();
};

module.exports.userPrevPage = (req, res, next) => {
  if (req.session.userPrevPage) {
    res.locals.userPrevPage = req.session.userPrevPage;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing not found!");
    return res.redirect(`/list/${id}`);
  }
  if (!data.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can't make changes!");
    return res.redirect(`/list/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let data = await Review.findById(reviewId);
  if (!data) {
    req.flash("error", "Review does not exist!");
    return res.redirect(`/list/${id}`);
  }
  if (!data.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can't make changes!");
    return res.redirect(`/list/${id}`);
  }
  next();
};
