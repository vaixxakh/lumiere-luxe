import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff,  } from 'lucide-react';
import { useAuthModal } from "../Context/AuthModalContext";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setShowLogin, setShowSignup, setUser } = useAuthModal();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;


    if (!email || !password) {
      setMsgType('error');
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try { 
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
         { withCredentials: true },

      );

      const {  user } = res.data;

      if (!user) {
        setMsgType('error');
        setMessage('User not found');
        setLoading(false);
        return;
      }

      if (user.blocked) {
        setMsgType('error');
        setMessage('Your account has been blocked. Please contact support.');
        setLoading(false);
        return;
      }

     
      localStorage.setItem('userInfo', JSON.stringify(user));
      setUser(user);  
      setMsgType('success');
      setMessage(`Welcome back, ${user.name}!`);

        setTimeout(() => {
        setShowLogin(false); 
      }, 800)

    } catch (error) {
      console.error(error);
      setMsgType('error');
      setMessage(' Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl  p-9 w-full max-w-md border  border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">Lu</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 text-sm mt-2">
          Login to your Lumiere account
        </p>
      </div>

     
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-center font-medium ${
            msgType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

  
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg w-full pr-10 focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded-lg font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Signup switch */}
      <p className="text-center text-sm mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          className="text-yellow-600 cursor-pointer font-semibold"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}

export default Login;
