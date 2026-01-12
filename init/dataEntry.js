const mongoose = require("mongoose");
const Listing = require("../models/listings");
const seedData = require("./data");

// connecting to mongodb
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/project");
}
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

const dataInsertion = async () => {
  // await Listing.deleteMany({});
  await Listing.insertMany(seedData);
  console.log("data inserted successfully!");
};

dataInsertion();
