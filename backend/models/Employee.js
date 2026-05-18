const mongoose = require("mongoose");

// Employee schema for performance analytics
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: 0,
      max: 100,
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
