import { Navigate } from "react-router-dom";

// Protects routes - redirects to login if no JWT token in localStorage
const Protected = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
