const Listing = require("../models/listings");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken:
    "pk.eyJ1IjoibmFlZW11bGxhaDAwMSIsImEiOiJjbWs2aGYzeWMwdWN4M2VwdGYzNGZwd3VmIn0.48sugvWZnbM58nzVevyXvQ",
});

module.exports.allLists = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/listings", { allListings });
};

module.exports.searchedListings = async (req, res) => {
  let searchQuery = (req.body.search || "").trim();
  if (!searchQuery) {
    return res.render("listings/searchedLists", { data: [] });
  }
  const results = await Listing.find({
    country: { $regex: searchQuery, $options: "i" },
  });
  results.country = searchQuery;
  res.render("listings/searchedLists", { list: results, searchQuery });
};

module.exports.getNewListingForm = (req, res) => {
  res.render("listings/new");
};

module.exports.postNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.location},${req.body.country}`,
      limit: 1,
    })
    .send();

  let { title, price, location, country, description } = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  let owner = req.user._id;
  const newListing = { title, description, price, location, country, owner };
  newListing.geometry = response.body.features[0].geometry;
  newListing.Image = { url, filename };
  await Listing.create(newListing);
  req.flash("success", "New Shelter added!");
  res.redirect("/list");
};

module.exports.getListingDetails = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Shelter do not exists!");
    return res.redirect("/list");
  }
  res.render("listings/listDetail", { list });
};

module.exports.getListEditingForm = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Requested data not found.");
    return res.redirect(`/list`);
  }
  res.render("listings/editList", { data });
};

// editing a list
module.exports.submittingModifiedList = async (req, res, next) => {
  let { id } = req.params;
  let { title, price, location, country, description } = req.body;
  const updateData = { title, description, price, location, country };
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested data not found.");
    return res.redirect(`/list/${id}`);
  }
  // Update geometry coordinates when location/country are changed
  try {
    const geo = await geocodingClient
      .forwardGeocode({
        query: `${location}, ${country}`,
        limit: 1,
      })
      .send();
    if (geo && geo.body && geo.body.features && geo.body.features.length > 0) {
      updateData.geometry = geo.body.features[0].geometry;
    }
  } catch (e) {
    console.error("Geocoding (edit) error:", e);
  }
  if (req.file) {
    try {
      if (listing.Image && listing.Image.filename) {
        await cloudinary.uploader.destroy(listing.Image.filename);
      }
    } catch (e) {
      console.error("Cloudinary deletion error:", e);
    }
    updateData.Image = { url: req.file.path, filename: req.file.filename };
  }
  await Listing.findByIdAndUpdate(id, updateData);
  req.flash("success", "Information Updated!");
  res.redirect(`/list/${id}`);
};

// deleting a list
module.exports.destroyingList = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested data not found.");
    return res.redirect("/list");
  }
  if (listing.Image && listing.Image.filename) {
    try {
      await cloudinary.uploader.destroy(listing.Image.filename);
    } catch (e) {
      console.error("Cloudinary deletion error:", e);
      req.flash("error", "Image could not be deleted from Cloudinary.");
    }
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Shelter Deleted!");
  res.redirect("/list");
};
