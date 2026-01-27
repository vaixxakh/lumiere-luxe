import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Star } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SkeletonCard from "../components/SkeletonCard";

// import Spinner from "../components/Spinner";

const ProductsPage = ({ searchTerm }) => {
  const { addToWishlist, removeFromWishlist, isWishlisted, addToCart, setSingleBuy } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [loading, setLoading ] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 8; 
  const navigate = useNavigate();


  useEffect(() => {
    setSearchParams({ page: currentPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, setSearchParams]);



  const handleAddToCart = ( product) => {
    
    addToCart({
        _id: product._id,
      name: product.name,
      price: product.price,    
      image: product.image,     
    });
    
    
    toast.success("🛒 Item added to cart!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
  };


  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    setSingleBuy(product);
    navigate("/payment");
  };


  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const wishlisted = isWishlisted(product._id);
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
   
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };


  /* ---------------- FETCH PRODUCTS ------------------*/
useEffect(() => {
  let mounted = true;
  const startTime = Date.now();

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/products`)
    .then((res) => {
        const elasped = Date.now() - startTime;
        const delay = Math.max(1000 - elasped, 0)

      if (mounted) {
        setTimeout(() => {
          setAllProducts(res.data);
          setLoading(false);
        },delay);
      }
    })
    .catch(() => setLoading(false));

  return () => {
    mounted = false;
  };
}, []);

    
  /* ---------------- FILTER + SORT ---------------- */

  const filteredProducts = allProducts
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory)

    .filter((p) =>
      p.name?.toLowerCase().includes((searchTerm || "").toLowerCase()))
    
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
    setLoading(true)
    setCurrentPage((p) => Math.max(p - 1, 1));
    setTimeout(() =>  setLoading(false), 600)
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentPage((p) => Math.min(p + 1, totalPages));
    setTimeout(() => setLoading(false), 600);

  }

   
  
  return (
    
    <section className="py-20 sm:py-24 md:py-32 bg-white min-h-screen">
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
      
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setLoading(true);  
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
                setTimeout(() => {
                    setLoading(false);
                }, 800);
              }}
              className="px-4 py-2 bg-white text-black text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="All">All Categories</option>
              <option value="Chandeliers">Chandeliers</option>
              <option value="Pendant">Pendant</option>
              <option value="Floor Light">Floor Light</option>
              <option value="Ceiling Light">Ceiling Light</option>
            </select>


            <select
              value={sortOrder}
              onChange={(e) => {
                setLoading(true);  
                setSortOrder(e.target.value);
                setCurrentPage(1);
                  setTimeout(() => {
                     setLoading(false);
                }, 800);
              }}
              className="px-4 py-2 bg-white text-black text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>


        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          
          {loading 
          ? Array.from({ length:8}).map((_, i) => (
            <SkeletonCard key={i} />
          ))
          :
          paginatedProducts.map((product, index) => {
            const wishlisted = isWishlisted(product._id);
            return (
              <motion.div
                 key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.08 }}
                    onClick={() => handleProductClick(product._id)}
                    className="bg-white  overflow-hidden shadow-sm cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
                  >
                    <Heart
                      size={18}
                      className={`${
                        wishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h2 className="text-sm sm:text-base font-semibold text-black mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 h-9">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-green-600 fill-green-600" />
                      <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                        {product.reviews.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-red-700">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>


                  {/* Action Buttons */}
                  {/* <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2  text-xs sm:text-sm transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e,product)}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-black  font-semibold py-2  text-xs sm:text-sm transition-colors"
                    >
                      Buy Now
                    </button>
                  </div> */}
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-10 text-base sm:text-lg">
            No products found for this search, category, or sort option.
          </p>
        )}


        {/* Pagination - RESPONSIVE */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
            <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors text-sm">
              Prev
            </button>


            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-black"
                    : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}


           <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors text-sm">
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};


export default ProductsPage;
