import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import AIRecommendation from "./pages/AIRecommendation";
import Protected from "./components/Protected";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/employees"
        element={
          <Protected>
            <EmployeeList />
          </Protected>
        }
      />
      <Route
        path="/ai-recommendations"
        element={
          <Protected>
            <AIRecommendation />
          </Protected>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
