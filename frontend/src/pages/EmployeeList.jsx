import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EmployeeCard from "../components/EmployeeCard";
import API from "../api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>All Employees</h1>
          <p style={{ color: "#64748b" }}>Total: {employees.length}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="search-bar">
          <input
            placeholder="Search by department"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={fetchEmployees} className="btn-secondary">
            Show All
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : employees.length === 0 ? (
          <div className="empty-state">No employees found.</div>
        ) : (
          <div className="employees-grid">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onEdit={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeList;
