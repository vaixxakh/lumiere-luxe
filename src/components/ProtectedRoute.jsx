import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("userInfo") || "null");

  
  if (!authData || !authData.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
