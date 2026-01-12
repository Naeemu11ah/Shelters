const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { userPrevPage } = require("../utils/middlewares");
const controllersUser = require("../controllers/user");

// "router.route" can be use to make the code more readable, but i will skip it in other files because it can make you struggle to understand the code in future
// used to combine routes, having common APIs

// signup
router
  .route("/signup")
  .get(controllersUser.renderSignupForm)
  .post(asyncWrap(controllersUser.postingSignupForm));

// logging in
router
  .route("/login")
  .get(controllersUser.renderLoginForm)
  .post(
    userPrevPage,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllersUser.afterLogin
  );

// logout
router.get("/logout", controllersUser.logout);

module.exports = router;
