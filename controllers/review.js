const Review = require("../models/reviews");
const Listing = require("../models/listings");

module.exports.postingReview = async (req, res, next) => {
  let id = req.params.id;
  let listing = await Listing.findOne({ _id: id });
  let { reviewRating, reviewComment } = req.body;
  const newReview = new Review({
    Comment: reviewComment,
    rating: reviewRating,
    author: req.user._id,
  });

  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success", "Review posted!");
  res.redirect(`/list/${id}`);
};

module.exports.renderEditingForm = async (req, res) => {
  let { id, reviewId } = req.params;
  let data = await Review.findById(reviewId);
  if (!data) {
    req.flash("error", "Review do not exists!");
    return res.redirect(`/list/${id}`);
  }
  res.render("listings/editReview", { data, id });
};

module.exports.postingModifiedReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let { reviewRating, reviewComment } = req.body;

  await Review.findByIdAndUpdate(reviewId, {
    Comment: reviewComment,
    rating: reviewRating,
  });
  req.flash("success", "Review updated!");
  res.redirect(`/list/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review Deleted!");
  res.redirect(`/list/${id}`);
};
