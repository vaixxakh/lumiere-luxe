
import { Navigate } from "react-router-dom";
import { useAuthModal } from "../Context/AuthModalContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const { setShowLogin } = useAuthModal();

  if (!user) {
    toast.warning("Please login to continue", {
      position: "top-center",
      autoClose: 1500,
    });

   
    setTimeout(() => setShowLogin(true), 0);

    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
