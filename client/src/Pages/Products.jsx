import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Star, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useAuthModal } from "../Context/AuthModalContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "../components/SkeletonCard";

const ProductsPage = ({ searchTerm }) => {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useCart();
  const { user } = useAuthModal();
  
  const [allProducts, setAllProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("none");
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL params
  const categoryParam = searchParams.get("category") || "All";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const itemsPerPage = 8;

  // Sync category state when URL query parameter changes
  useEffect(() => {
    const category = searchParams.get("category") || "All";
    setSelectedCategory(category);
    setCurrentPage(1);
  }, [searchParams]);

  // Handle URL page updates
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Fetch all products
  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(1000 - elapsed, 0);

        if (mounted) {
          setTimeout(() => {
            setAllProducts(res.data);
            setLoading(false);
          }, delay);
        }
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (!user || !user.token) {
      toast.error("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }

    const wishlisted = isWishlisted(product._id);
    if (wishlisted) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (newCategory) => {
    setLoading(true);
    setSelectedCategory(newCategory);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams);
    if (newCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    params.set("page", 1);
    setSearchParams(params);

    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleSortChange = (newSort) => {
    setLoading(true);
    setSortOrder(newSort);
    setCurrentPage(1);

    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Filter and Sort logic
  const filteredProducts = allProducts
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      p.name?.toLowerCase().includes((searchTerm || "").toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePrev = () => {
    setLoading(true);
    setCurrentPage((p) => Math.max(p - 1, 1));
    setTimeout(() => setLoading(false), 500);
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentPage((p) => Math.min(p + 1, totalPages));
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <section className="py-24 sm:py-32 bg-slate-50/50 min-h-screen relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Luxury Page Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] font-bold text-yellow-600 uppercase block mb-2">
            Lumiere Luxe
          </span>
          <h1 className="text-4xl sm:text-5xl font-luxury font-bold text-slate-900 tracking-wide mb-3">
            {selectedCategory === "All" ? "The Lighting Collection" : `${selectedCategory}`}
          </h1>
          <div className="w-16 h-[2px] bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
          {searchTerm && (
            <p className="mt-4 text-sm text-slate-500 font-medium">
              Showing search results for "<span className="text-yellow-600 font-bold">{searchTerm}</span>"
            </p>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Category Select */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto">
              <SlidersHorizontal size={16} className="text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-transparent text-slate-800 text-xs sm:text-sm font-semibold outline-none w-full cursor-pointer pr-4"
              >
                <option value="All">All Categories</option>
                <option value="Chandeliers">Chandeliers</option>
                <option value="Pendant">Pendant Lights</option>
                <option value="Floor Light">Floor Lights</option>
                <option value="Ceiling Light">Ceiling Lights</option>
              </select>
            </div>

            {/* Price Sort Select */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto">
              <ArrowUpDown size={16} className="text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent text-slate-800 text-xs sm:text-sm font-semibold outline-none w-full cursor-pointer pr-4"
              >
                <option value="none">Default Sort</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Results Counter */}
          <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} found
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              // Skeleton Loaders
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : (
              // Products List
              paginatedProducts.map((product, index) => {
                const wishlisted = isWishlisted(product._id);
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => handleProductClick(product._id)}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-yellow-500/20 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
                  >
                    {/* Image Container with Zoom hover effect */}
                    <div className="relative overflow-hidden aspect-square bg-slate-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group/heart"
                        aria-label="Toggle wishlist"
                      >
                        <Heart
                          size={16}
                          className={`transition-colors duration-200 ${
                            wishlisted
                              ? "text-red-500 fill-red-500"
                              : "text-slate-400 group-hover/heart:text-red-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details Content */}
                    <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-slate-50/50">
                      {/* Category */}
                      <span className="text-[9px] tracking-widest font-extrabold text-yellow-600 uppercase block mb-1.5">
                        {product.category}
                      </span>
                      
                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] group-hover:text-yellow-600 transition-colors duration-300 leading-snug mb-2">
                        {product.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-grow">
                        {product.description}
                      </p>
                      
                      {/* Rating & Price Bottom Row */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-1 bg-green-50 border border-green-100 rounded-lg px-2 py-0.5">
                          <Star size={12} className="text-green-600 fill-green-600" />
                          <span className="text-[11px] text-green-700 font-extrabold">
                            {product.reviews.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-base font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* No Products Found State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-slate-100 rounded-3xl mt-8 shadow-sm"
          >
            <p className="text-slate-500 font-medium text-lg mb-2">
              No lighting fixtures found
            </p>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              We couldn't find any products matching your current filters or search term. Try switching categories or clearing search.
            </p>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-2 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-xs cursor-pointer shadow-sm"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-black border border-yellow-500"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-xs cursor-pointer shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
