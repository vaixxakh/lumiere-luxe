import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("userInfo") || "null");
  const isAuthenticated = authData && authData.token;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access this feature.");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

