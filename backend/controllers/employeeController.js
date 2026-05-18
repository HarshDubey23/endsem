const Employee = require("../models/Employee");

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } =
      req.body;

    if (
      !name ||
      !email ||
      !department ||
      performanceScore === undefined ||
      experience === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email, department, performanceScore and experience",
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      department,
      skills: Array.isArray(skills) ? skills : skills ? skills.split(",") : [],
      performanceScore: Number(performanceScore),
      experience: Number(experience),
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Employee email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// Search/filter employees by department
const searchEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Please provide department query parameter",
      });
    }

    const employees = await Employee.find({
      department: { $regex: department, $options: "i" },
    }).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search employees",
      error: error.message,
    });
  }
};

// Update employee by ID
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, skills, performanceScore, experience } =
      req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await Employee.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Another employee already uses this email",
        });
      }
    }

    employee.name = name || employee.name;
    employee.email = email ? email.toLowerCase() : employee.email;
    employee.department = department || employee.department;
    employee.skills = skills
      ? Array.isArray(skills)
        ? skills
        : skills.split(",")
      : employee.skills;
    employee.performanceScore =
      performanceScore !== undefined
        ? Number(performanceScore)
        : employee.performanceScore;
    employee.experience =
      experience !== undefined ? Number(experience) : employee.experience;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// Delete employee by ID
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
};
