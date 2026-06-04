import React from "react";
import generatedVideo from "../../assets/generated-video.mp4";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LuxuryLightShop() {
  return (
    <>
      {/* Background Video Section */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={generatedVideo}
        ></video>

        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Text Content - Responsive */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs tracking-[0.4em] font-bold text-yellow-400 uppercase mb-3 block"
          >
            Signature Collection
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury font-bold text-yellow-100 drop-shadow-lg leading-tight"
          >
            Discover the Glow of Luxury
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl font-medium tracking-wide"
          >
            Explore exclusive chandeliers, pendant lights, and designer fixtures crafted for elegance.
          </motion.p>
        </div>
      </section>

      {/* Explore More Button - Responsive */}
      <div className="flex justify-center mt-10 mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            to="/products"
            className="bg-black text-white hover:bg-white hover:text-black hover:border-black border border-transparent font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-xs sm:text-sm tracking-widest uppercase cursor-pointer"
          >
            Explore More
          </Link>
        </motion.div>
      </div>
    </>
  );
}

export default LuxuryLightShop;
