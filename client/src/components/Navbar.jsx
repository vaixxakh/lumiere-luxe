import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { Link, useNavigate,useLocation} from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { motion } from 'framer-motion';
import { useAuthModal } from "../Context/AuthModalContext";
import logo from "../assets/lumiere/logo-lumiere.png"
import "./Navbar.css";

function Navbar({ onSearch = () => {} }) {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const userMenuRefMobile = useRef(null);

  const { user, setUser, setShowLogin, setShowSignup } = useAuthModal();


  const isProductsPage = location.pathname === "/products";


  const { cartCount, wishlistCount } = useCart();


  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchItem.trim()) return;
    onSearch(searchItem);
    navigate("/products");
    setShowSearch(false);
  };
const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload(); 
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (!userMenuRef.current || !userMenuRef.current.contains(event.target)) &&
        (!userMenuRefMobile.current || !userMenuRefMobile.current.contains(event.target))
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleNavClick = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path); 
    }
  };
   const handleLogout = () => {
    localStorage.removeItem("userInfo");  
    setUser(null);
    setShowUserMenu(false);
    setShowLogin(true);
  };


  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg border-b border-gray-200 z-50 navbar">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3 navbar-container">
        {/* LOGO */}
        <div className="logo-wrapper">
              <Link
          to="/"
          onClick={() => handleNavClick("/")}
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Lumiere Lighting Logo"
            className="logo"
          />
        </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center mt-4 gap-4 font-small text-gray-700 nav-menu-text ">
          <Link to="/" onClick={() => handleNavClick("/")} className="hover-underline">HOME</Link>
          <Link to="/about" onClick={() => handleNavClick("/about")} className="hover-underline" >ABOUT</Link>
          <Link to="/products" onClick={() => handleNavClick("/products")} className="hover-underline" >SHOP BY</Link>
          <Link to="/contact" onClick={() => handleNavClick("/contact")} className="hover-underline" >CONTACT US</Link>
          {/* <Link to="/contact" onClick={() => handleNavClick("/contact")} className="hover-underline" >CATEGORIES</Link>
          <Link to="/contact" onClick={() => handleNavClick("/contact")} className="hover-underline" >GALLERY</Link> */}
        </div>

        {/* DESKTOP ICONS */}
        <div className="hidden md:flex items-center space-x-6 gap-3 text-gray-700 relative">
          {isProductsPage && (
            <>
              {showSearch ? (
                <X
                  onClick={() => setShowSearch(false)}
                  size={22}
                  className="cursor-pointer hover:text-yellow-600 transition"
                />
              ) : (
                <Search
                  onClick={() => setShowSearch(true)}
                  size={22}
                  className="cursor-pointer hover:text-yellow-600 transition"
                />
              )}
            </>
          )}


          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-red-600 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-semibold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown - Desktop */}
          <div ref={userMenuRef} className="relative flex items-center gap-2">
            <User
              className="cursor-pointer hover:text-yellow-600 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {user && (
              <span className="text-gray-700 font-medium hidden sm:inline">
                Hey, <span className="text-yellow-500">{user.name.split(" ")[0]}</span>
              </span>
            )}

            {showUserMenu && (
              <motion.div   
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1], 
              }}
              className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/account"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  Account
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  My Orders
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      onClick={() => {
                          setShowUserMenu(false);
                          setShowSignup(false);
                          setShowLogin(true);
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogin(false);
                        setShowSignup(true);
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTONS */}
        <div className="md:hidden flex items-center gap-5 ">
          {isProductsPage && (
          <>
            {showSearch ? (
              <X
                onClick={() => setShowSearch(false)}
                size={22}
                className="cursor-pointer  hover:text-yellow-600 transition text-red-700"
              />
            ) : (
              <Search
                onClick={() => setShowSearch(true)}
                size={22}
                className="cursor-pointer hover:text-yellow-600 transition "
              />
            )}
          </>
        )}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer   hover:text-yellow-600 transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-yellow-600   transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-semibold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE USER ICON */}
          <div ref={userMenuRefMobile} className="relative">
            <User
              className="cursor-pointer hover:text-yellow-600  transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />

            {showUserMenu && (
              <motion.div
               initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1], 
              }}

               className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Account
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                       onClick={() => {
                        setShowUserMenu(false);
                        setShowLogin(false);
                        setShowSignup(true);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogin(false);
                        setShowSignup(true);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className ="text-red-500" size={26} /> : <Menu  size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV LINKS */}
      {isOpen && (
        <motion.div 
        initial={{ opacity: 0, y: -50, scaleY: 0.9 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: -30, scaleY: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.5,
        }}
        className="md:hidden flex flex-col items-center bg-white border-t border-gray-200 shadow-lg py-4 space-y-3 text-gray-700 font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">HOME</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">ABOUT</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">PRODUCTS</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-yellow-600">CONTACT US</Link>
        </motion.div>
      )}

      {/* SEARCH BAR OVERLAY */}
      {showSearch && (
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 1, 0.5, 1], // smooth "easeOutBack" style
        }}

        className="fixed top-16 left-0 w-full  bg-white px-4 py-2 flex justify-center z-40 shadow-lg border-b border-gray-200">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md flex items-center bg-gray-100 border border-gray-300 rounded-full shadow-sm px-4 py-2"
          >
            <input
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="Search for lights, chandeliers, lamps..."
              className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500 px-2"
            />
            <button type="submit" className="text-yellow-600 hover:text-yellow-700 transition">
              <Search />
            </button>
          </form>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
