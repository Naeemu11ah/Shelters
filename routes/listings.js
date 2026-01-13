const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const { isUserLoggedIn } = require("../utils/middlewares");
const { isOwner } = require("../utils/middlewares");
const controllersListings = require("../controllers/listings");
const validateListing = require("../utils/validateListing");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// all lists
router.get("/", asyncWrap(controllersListings.allLists));

// searched listings
router.post("/search", asyncWrap(controllersListings.searchedListings));

// adding new list
router.get("/new", isUserLoggedIn, controllersListings.getNewListingForm);
router.post(
  "/new",
  isUserLoggedIn,
  upload.single("url"),
  validateListing,
  asyncWrap(controllersListings.postNewListing)
);

// details of each list
router.get("/:id", asyncWrap(controllersListings.getListingDetails));

// editing a list
router.get(
  "/:id/edit",
  isUserLoggedIn,
  isOwner,
  asyncWrap(controllersListings.getListEditingForm)
);
router.patch(
  "/:id/edit",
  isUserLoggedIn,
  isOwner,
  upload.single("url"),
  asyncWrap(controllersListings.submittingModifiedList)
);

// deleting a list
router.delete(
  "/:id/delete",
  isUserLoggedIn,
  isOwner,
  asyncWrap(controllersListings.destroyingList)
);

module.exports = router;
