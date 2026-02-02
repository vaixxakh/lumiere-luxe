import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!authData || !authData.token) {
    return <Navigate to="/login" replace />;
  }

  if (!authData.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;    
};

export default AdminRoute;
