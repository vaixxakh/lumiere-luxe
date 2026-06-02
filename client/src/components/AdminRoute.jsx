import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!authData || !authData.token || !authData.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
