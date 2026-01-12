const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");
const { isAuthor } = require("../utils/middlewares");
const { isUserLoggedIn } = require("../utils/middlewares");
const controllersReview = require("../controllers/review");
const validateReview = require("../utils/validateReview");

// posting a Review
router.post("/", isUserLoggedIn, validateReview, asyncWrap(controllersReview.postingReview));

// editing a review
router.get(
  "/:reviewId/edit",
  isUserLoggedIn,
  isAuthor,
  asyncWrap(controllersReview.renderEditingForm)
);
router.patch(
  "/:reviewId/edit",
  isAuthor,
  isUserLoggedIn,
  validateReview,
  asyncWrap(controllersReview.postingModifiedReview)
);

// deleting review
router.delete(
  "/:reviewId/delete",
  isUserLoggedIn,
  isAuthor,
  asyncWrap(controllersReview.destroyReview)
);

module.exports = router;
