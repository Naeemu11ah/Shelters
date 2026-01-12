const Joi = require("joi");
const expressError = require("./expressError");

const reviewSchema = Joi.object({
  reviewRating: Joi.number().integer().min(1).max(5).required(),
  reviewComment: Joi.string().min(2).max(100).required(),
});

module.exports = function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, msg));
  }
  next();
};
