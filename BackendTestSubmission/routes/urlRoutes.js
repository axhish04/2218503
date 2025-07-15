const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

// POST /shorturls
router.post("/shorturls", urlController.createShortURL);

// GET /shorturls/:shortcode
router.get("/shorturls/:shortcode", urlController.getStats);

// GET /:shortcode (for redirect)
router.get("/:shortcode", urlController.redirectToURL);

module.exports = router;
