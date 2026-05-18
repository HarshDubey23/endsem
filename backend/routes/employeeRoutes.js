const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

// All employee routes are protected with JWT
router.post("/", protect, createEmployee);
router.get("/", protect, getEmployees);
router.get("/search", protect, searchEmployees);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

module.exports = router;
