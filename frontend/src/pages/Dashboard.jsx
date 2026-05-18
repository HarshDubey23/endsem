import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import EmployeeCard from "../components/EmployeeCard";
import API from "../api";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  skills: "",
  performanceScore: "",
  experience: "",
};

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [searchDept, setSearchDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name: form.name,
      email: form.email,
      department: form.department,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      performanceScore: Number(form.performanceScore),
      experience: Number(form.experience),
    };

    try {
      if (editId) {
        await API.put(`/employees/${editId}`, payload);
        setMessage("Employee updated successfully");
      } else {
        await API.post("/employees", payload);
        setMessage("Employee added successfully");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee._id);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      skills: employee.skills?.join(", ") || "",
      performanceScore: employee.performanceScore,
      experience: employee.experience,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setMessage("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSearch = async () => {
    if (!searchDept.trim()) {
      fetchEmployees();
      return;
    }
    try {
      setLoading(true);
      const res = await API.get(
        `/employees/search?department=${encodeURIComponent(searchDept)}`
      );
      setEmployees(res.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>HR Dashboard</h1>
          <Link to="/ai-recommendations">
            <button className="btn-ai">Generate AI Insights</button>
          </Link>
        </div>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <div className="form-panel">
          <h2>{editId ? "Update Employee" : "Add New Employee"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="IT, HR, Sales"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label>Performance Score (0-100)</label>
                <input
                  name="performanceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={form.performanceScore}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  name="experience"
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
              {editId ? "Update Employee" : "Add Employee"}
            </button>
            {editId && (
              <button type="button" className="btn-secondary" onClick={cancelEdit} style={{ marginLeft: 10 }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="search-bar">
          <input
            placeholder="Filter by department (e.g. IT)"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={fetchEmployees} className="btn-secondary">
            Reset
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading employees...</p>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found. Add your first employee above.</p>
          </div>
        ) : (
          <div className="employees-grid">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
