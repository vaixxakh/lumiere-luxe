import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, UserCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from "../Context/AuthModalContext";
import logo from "../assets/lumiere/logo-lumiere.png";
import "./Navbar.css";

function Navbar({ onSearch = () => {}, initialSearchTerm = "" }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchItem, setSearchItem] = useState(initialSearchTerm);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const { user, setUser, setShowLogin, setShowSignup } = useAuthModal();
  const { cartCount, wishlistCount } = useCart();

  useEffect(() => {
    setSearchItem(initialSearchTerm);
  }, [initialSearchTerm]);

  // Focus search input when search bar opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchItem.trim()) {
      onSearch(searchItem);
      if (location.pathname !== "/products") {
        navigate("/products");
      }
      setShowSearch(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchItem(val);
    onSearch(val);
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "COLLECTIONS", path: "/products" },
    { name: "CONTACT US", path: "/contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4 h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={() => handleNavClick("/")} className="block">
              <img
                src={logo}
                alt="Lumiere Luxury Lighting"
                className="h-10 sm:h-12 w-auto object-contain transition-all duration-300 hover:opacity-90"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`relative text-xs tracking-[0.2em] font-semibold text-slate-800 hover:text-yellow-600 transition-all duration-300 pb-1 cursor-pointer font-luxury-nav ${
                  location.pathname === link.path ? "text-yellow-600" : ""
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-slate-700">
            
            {/* Search Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 hover:text-yellow-600 transition-colors duration-200 cursor-pointer"
              aria-label="Search"
            >
              {showSearch ? <X size={20} className="text-red-500" /> : <Search size={20} />}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-1.5 hover:text-red-500 transition-colors duration-200 relative block"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold transform translate-x-1 -translate-y-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-1.5 hover:text-yellow-600 transition-colors duration-200 relative block"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-500 text-black rounded-full flex items-center justify-center text-[9px] font-extrabold transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown - Desktop */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1.5 hover:text-yellow-600 transition-colors duration-200 cursor-pointer"
                aria-label="User menu"
              >
                <User size={20} />
                {user && (
                  <span className="text-xs font-semibold text-slate-800">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                        >
                          <User size={14} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                        >
                          <ShoppingCart size={14} /> My Orders
                        </Link>
                        {user.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-amber-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <UserCheck size={14} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full border-t border-gray-50 mt-1 flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowSignup(false);
                            setShowLogin(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors cursor-pointer"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowLogin(false);
                            setShowSignup(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 hover:text-yellow-600 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} className="text-red-500" /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 px-4 py-4 flex justify-center z-40 shadow-lg"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full max-w-xl flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 shadow-inner"
              >
                <Search size={18} className="text-slate-400 mr-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchItem}
                  onChange={handleSearchChange}
                  placeholder="Search modern chandeliers, pendants, sconces..."
                  className="flex-grow bg-transparent outline-none text-slate-800 text-sm placeholder-slate-400 pr-2"
                />
                {searchItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchItem("");
                      onSearch("");
                    }}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-h-[80vh] overflow-y-auto px-6 py-8 flex flex-col shadow-2xl border-t border-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-6 text-center">
                {navLinks.map((link, idx) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleNavClick(link.path)}
                    className={`text-sm tracking-[0.25em] font-extrabold pb-2 border-b border-transparent font-luxury-nav cursor-pointer ${
                      location.pathname === link.path ? "text-yellow-600 border-yellow-500/20" : "text-slate-800"
                    }`}
                  >
                    {link.name}
                  </motion.button>
                ))}

                {/* Mobile User Profile Section */}
                <div className="border-t border-slate-100 pt-6 mt-4 flex flex-col items-center">
                  {user ? (
                    <div className="w-full flex flex-col items-center space-y-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Logged in as</p>
                        <p className="text-base font-bold text-slate-800">{user.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate("/account");
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl border border-slate-200 transition cursor-pointer"
                        >
                          Account
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate("/orders");
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl border border-slate-200 transition cursor-pointer"
                        >
                          Orders
                        </button>
                      </div>
                      {user.isAdmin && (
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate("/admin");
                          }}
                          className="w-full max-w-xs bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-extrabold py-3 rounded-xl border border-amber-200 transition cursor-pointer"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full max-w-xs bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-3 rounded-xl border border-red-200 transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-xs flex flex-col space-y-3">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowSignup(false);
                          setShowLogin(true);
                        }}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowLogin(false);
                          setShowSignup(true);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
