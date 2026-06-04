import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Crystal Chandelier",
    category: "Chandeliers",
    description: "Elegant crystal chandelier with gold finish and warm glow.",
    image: "https://i5.walmartimages.com/seo/FINE-MAKER-Luxury-Crystal-Chandelier-Pendant-Light-Gold-Finish-Ceiling-Hanging-Light-Fixture-for-Living-Room-Hallway-Foyer-15-Light-23_265dcead-11fb-43ed-a799-9675b0dd1024.6635ddcea86a563a27195b236c8126de.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  },
  {
    id: 2,
    name: "Modern Pendant Light",
    category: "Pendant",
    description: "Minimalist design with matte black body and LED lighting.",
    image: "https://static.vecteezy.com/system/resources/thumbnails/019/946/978/small/ceiling-light-bulbs-vintage-lamp-bulb-decorative-in-home-photo.jpg",
  },
  {
    id: 3,
    name: "Wall Sconce Lamp",
    category: "Ceiling Light",
    description: "Soft wall-mounted light with brass finish for classic interiors.",
    image: "https://flyachilles.com/cdn/shop/files/brass-vintage-wall-sconce-light-retro-luxury-stairwell-wall-lamp-149163.jpg?v=1721729694&width=1500",
  },
  {
    id: 4,
    name: "Luxury Floor Lamp",
    category: "Floor Light",
    description: "Contemporary tall lamp with marble base and ambient shade.",
    image: "https://cdn11.bigcommerce.com/s-0z4jan/images/stencil/1280x1280/products/1372/6901/baroque_floor_lamp_3__13570.1441079846.jpg?c=2",
  },
];

const LuxuryProducts = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="min-h-screen py-16 px-4 bg-slate-50/20" id="products">
      
      {/* Title Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <span className="text-[10px] tracking-[0.3em] font-bold text-yellow-600 uppercase block mb-2">
          Curated Styles
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-bold text-slate-900 mb-3">
          Shop by Categories
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-2 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
            onClick={() => handleCategoryClick(product.category)}
            className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:border-yellow-500/20 border border-slate-100 cursor-pointer transition-all duration-300"
          >
            {/* Image Container with Overlay */}
            <div className="relative overflow-hidden h-56 sm:h-64 bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Content */}
            <div className="p-6 bg-gradient-to-b from-white to-slate-50/50">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                {product.description}
              </p>
              
              {/* Decorative Element */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-[2px] bg-yellow-400 group-hover:w-16 transition-all duration-300"></div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-yellow-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  Explore Category
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LuxuryProducts;
