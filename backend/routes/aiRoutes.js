const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getAIRecommendations } = require("../controllers/aiController");

const router = express.Router();

// Protected AI recommendation route
router.post("/recommend", protect, getAIRecommendations);

module.exports = router;
