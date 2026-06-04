import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, X, ArrowLeft } from 'lucide-react';
import { useAuthModal } from "../Context/AuthModalContext";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setShowLogin, setShowSignup, setUser } = useAuthModal();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsgType("error");
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, token  } = res.data;
      
      const authData = {
        ...user,
        token, 
      };

      localStorage.setItem("userInfo", JSON.stringify(authData));
      setUser(authData);

      setMsgType("success");
      setMessage(`Welcome back, ${user.name}!`);

      setTimeout(() => {
        setShowLogin(false);

        if (user.isAdmin) {
          navigate("/admin");  
          return;
        } else {
          navigate("/");
        }
      }, 800);

    } catch (error) {
      console.error(error);
      setMsgType("error");
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isModal = !["/login", "/signup"].includes(location.pathname);

  const cardContent = (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transform hover:rotate-12 transition duration-300">
          <span className="text-white font-bold text-2xl">Lu</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1.5">
          Login to your Lumiere Luxury account
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-center text-sm font-semibold transition-all duration-300 ${
            msgType === "success" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition duration-200 text-gray-800 placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-xl w-full pr-10 focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] w-full py-3.5 rounded-xl font-bold text-black shadow-md hover:shadow-lg transition duration-200 mt-2 block"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
            if (!isModal) navigate("/signup");
          }}
          className="text-yellow-600 hover:text-yellow-700 cursor-pointer font-bold transition"
        >
          Sign up
        </span>
      </p>
    </>
  );

  if (isModal) {
    return (
      <div className="relative bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md border border-gray-100 transition duration-300">
        <button 
          onClick={() => setShowLogin(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
        {cardContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-gray-950 via-gray-900 to-black p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-600/10 blur-[120px]" />
      
      <div className="w-full max-w-md bg-white shadow-2xl p-8 rounded-2xl border border-gray-100 relative z-10 transition duration-300">
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-4 left-4 text-gray-500 hover:text-yellow-600 transition flex items-center gap-1 text-xs font-bold uppercase tracking-wider p-1"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <div className="mt-4">
          {cardContent}
        </div>
      </div>
    </div>
  );
}

export default Login;
