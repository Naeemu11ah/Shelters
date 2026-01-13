const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");

// getting terms and condition page
router.get(
  "/terms",
  asyncWrap(async (req, res) => {
    res.render("pages/terms&conditions");
  })
);

// getting privacy and policy page
router.get(
  "/privacy",
  asyncWrap(async (req, res) => {
    res.render("pages/privacyPolicy");
  })
);

module.exports = router;
