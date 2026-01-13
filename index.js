if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const reviewRoute = require("./routes/review");
const listingsRoute = require("./routes/listings");
const userRoute = require("./routes/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_ATLAS_URL,
  crypto: {
    secret: process.env.MY_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("Error in Mongo Session store!", err);
});

const sessionOption = {
  store,
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 14 * 24 * 60 * 60 * 1000,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("__method"));
app.use(session(sessionOption));
app.use(flash());
// lines having "passport" are added for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connecting to mongodb
async function main() {
  // mongodb://localhost:27017/project
  await mongoose.connect(process.env.MONGODB_ATLAS_URL);
}
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

// flash messages middleware
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  res.locals.currentUser = req.user;
  app.locals.capitalize = function (str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  next();
});

// routing
app.use("/list", listingsRoute);
app.use("/list/:id/review", reviewRoute);
app.use("/", userRoute);

// Error handling middlewares
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.use((req, res, next) => {
  let message = "Page Not Found!";
  res.status(404).render("error.ejs", { message });
});

app.listen(PORT);
