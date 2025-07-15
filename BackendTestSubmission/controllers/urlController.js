const Log = require("../../LoggingMiddleware/log");
const { generateShortcode } = require("../utils/generateShortcode");

const urlDB = {}; // In-memory storage
const statsDB = {}; // Track clicks

// Create a short URL
exports.createShortURL = (req, res) => {
    try {
        const { url, validity = 30, shortcode } = req.body;

        if (!url || typeof url !== "string") {
            Log("backend", "error", "controller", "Invalid URL input");
            return res.status(400).json({ error: "Invalid URL format" });
        }

        let code = shortcode || generateShortcode();
        if (urlDB[code]) {
            Log("backend", "error", "controller", "Shortcode collision");
            return res.status(409).json({ error: "Shortcode already in use" });
        }

        const expiry = new Date(Date.now() + validity * 60000);
        urlDB[code] = { url, expiry, createdAt: new Date() };
        statsDB[code] = [];

        Log("backend", "info", "controller", `Created short URL for ${url}`);
        return res.status(201).json({
            shortLink: `http://localhost:5000/${code}`,
            expiry: expiry.toISOString()
        });
    } catch (err) {
        Log("backend", "fatal", "controller", err.message);
        return res.status(500).json({ error: "Server error" });
    }
};

// Get statistics for a short URL
exports.getStats = (req, res) => {
    try {
        const code = req.params.shortcode;
        const record = urlDB[code];

        if (!record) {
            Log("backend", "error", "controller", "Shortcode not found");
            return res.status(404).json({ error: "Shortcode not found" });
        }

        const clicks = statsDB[code];
        return res.json({
            originalURL: record.url,
            createdAt: record.createdAt,
            expiry: record.expiry,
            totalClicks: clicks.length,
            clickDetails: clicks
        });
    } catch (err) {
        Log("backend", "fatal", "controller", err.message);
        return res.status(500).json({ error: "Server error" });
    }
};

// Redirect to the original URL
exports.redirectToURL = (req, res) => {
    try {
        const code = req.params.shortcode;
        const record = urlDB[code];

        if (!record) {
            Log("backend", "error", "controller", "Shortcode not found for redirection");
            return res.status(404).send("Shortcode not found");
        }

        if (new Date() > record.expiry) {
            Log("backend", "warning", "controller", "Link expired");
            return res.status(410).send("Link expired");
        }

        statsDB[code].push({
            timestamp: new Date(),
            referrer: req.get('Referrer') || 'Direct',
            location: "India" // Dummy location
        });

        Log("backend", "info", "controller", `Redirecting to ${record.url}`);
        res.redirect(record.url);
    } catch (err) {
        Log("backend", "fatal", "controller", err.message);
        res.status(500).send("Server error");
    }
};
