  import { useState } from 'react';
  import axios from 'axios';
  import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
  import { useAuthModal } from "../Context/AuthModalContext";

  function SignUp() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setShowSignup, setShowLogin } = useAuthModal();

    const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMsgType("error");
      setMessage("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setMsgType("error");
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email, password }
      );

      setMsgType("success");
      setMessage("Signup successful! Redirecting to login...");

      setTimeout(() => {
        setShowSignup(false);
        setShowLogin(true);
      }, 1000);

    } catch (error) {
      setMsgType("error");
      setMessage(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };



    return(
    <div className="bg-white shadow-2xl  p-8 w-full max-w-md border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">Lu</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 text-sm mt-2">
          Join Lumiere today
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-center font-medium ${
            msgType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Email Address
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* Login switch */}
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <span
          onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          className="text-yellow-600 cursor-pointer font-semibold"
        >
          Login here
        </span>
      </p>
    </div>
  );
  }

  export default SignUp;
