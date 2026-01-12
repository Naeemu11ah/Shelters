let User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.postingSignupForm = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      email: email,
      username: username,
    });
    await User.register(newUser, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to shelters!");
      res.redirect("/list");
    });
  } catch {
    req.flash("error", "Name is already taken!");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.afterLogin = async (req, res) => {
  req.flash("success", "Successfully Logged in!");
  let userPrevPage = res.locals.userPrevPage || "/list";
  res.redirect(userPrevPage);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully Logged out!");
    res.redirect("/list");
  });
};
