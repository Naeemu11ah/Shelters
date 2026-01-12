const Joi = require("joi");
const expressError = require("./expressError");

const listingSchema = Joi.object({
  title: Joi.string().min(2).max(80).required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().min(2).max(60).required(),
  country: Joi.string().min(2).max(30).required(),
  description: Joi.string().min(2).max(200).required(),
});

module.exports = function validateListing(req, res, next) {
  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, msg));
  }
  next();
};
