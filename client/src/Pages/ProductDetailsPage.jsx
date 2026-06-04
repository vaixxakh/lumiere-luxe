import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, Plus, Minus, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { useAuthModal } from '../Context/AuthModalContext';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    addToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isWishlisted,  
  } = useCart();

  const { user } = useAuthModal();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Zoom Magnifier state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Product not found!');
        navigate('/products');
      });
  }, [id, navigate]);

  /* ================= CART ACTIONS ================= */
  const handleAddToCart = async () => {
    if (!user || !user.token) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }

    const productWithQuantity = { ...product, quantity };
    await addToCart(productWithQuantity);

    toast.success(`🛒 ${quantity} item(s) added to cart!`, {
      position: 'top-center',
      autoClose: 2000,
      theme: 'colored',
    });
  };

  const handleBuyNow = async () => {
    if (!user || !user.token) {
      toast.error("Please log in to purchase products.");
      navigate('/login');
      return;
    }
    const productWithQuantity = { ...product, quantity };
    await addToCart(productWithQuantity);
    navigate('/payment');
  };

  const productId = product?._id || product?.id;
  const wishlisted = productId ? isWishlisted(productId) : false;

  const handleWishlist = () => {
    if (!user || !user.token) {
      toast.error("Please log in to add items to your wishlist.");
      navigate('/login');
      return;
    }

    if (wishlisted) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  /* ================= QUANTITY ================= */
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  /* ================= MAGNIFIER EVENTS ================= */
  const handleMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-[3px] border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Loading Luxury Piece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-bold">Product not found</p>
      </div>
    );
  }

  /* ================= THUMBNAIL GALLERY ================= */
  const getThumbnailGallery = (prod) => {
    const base = prod.image;
    if (prod.category === "Chandeliers") {
      return [
        base,
        "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop"
      ];
    }
    if (prod.category === "Pendant") {
      return [
        base,
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop"
      ];
    }
    return [
      base,
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop"
    ];
  };

  const productImages = getThumbnailGallery(product);

  return (
    <div className="min-h-screen bg-slate-50/30 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-yellow-600 font-bold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          
          {/* Left Side: Images & Gallery */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Main Image with Magnifier Zoom */}
            <div
              className="relative overflow-hidden aspect-square bg-slate-50 border border-slate-100 rounded-2xl cursor-zoom-in shadow-sm group"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-150 ease-out origin-center ${
                  isZooming ? 'scale-[2.2]' : 'scale-100'
                }`}
                style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
              
              {/* Wishlist Button Overlay */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={20}
                  className={`transition-all duration-300 ${
                    wishlisted
                      ? 'text-red-500 fill-red-500 scale-110'
                      : 'text-slate-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-slate-50 overflow-hidden border-2 rounded-xl transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-yellow-500 scale-[1.03] shadow-md'
                      : 'border-slate-100 hover:border-yellow-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* Right Side: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
            
            <div>
              {/* Category Tag */}
              <span className="text-[10px] tracking-[0.25em] font-extrabold text-yellow-600 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full inline-block mb-4 uppercase">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.reviews)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-500 text-sm font-semibold pt-0.5">
                  {(product.reviews ?? 0).toFixed(1)} / 5.0 Rating
                </span>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 sm:p-5 mb-6">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">
                  ₹{Number(product.price).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Inclusive of all taxes & free shipping insured
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs tracking-widest font-extrabold text-slate-400 uppercase mb-2">
                  Description
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {product.description || "Indulge in luxury illumination. This designer lighting fixture elevates any modern living area, hall, or commercial lobby with its radiant light flow and premium handcrafted components."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-xs tracking-widest font-extrabold text-slate-400 uppercase mb-3">
                  Quantity
                </h3>
                <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 gap-2">
                  <button
                    onClick={decrementQuantity}
                    className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-600 shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-extrabold text-slate-800 w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-600 shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm tracking-wider uppercase active:scale-[0.99]"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm tracking-wider uppercase active:scale-[0.99]"
              >
                Buy Now
              </button>

            </div>

            {/* Product Trust Features list */}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide">Free Shipping</h4>
                    <p className="text-[10px] text-slate-500">Insured Delivery</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide">5-Year Warranty</h4>
                    <p className="text-[10px] text-slate-500">Quality Certified</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide">30-Day Return</h4>
                    <p className="text-[10px] text-slate-500">Hassle-Free Swap</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
