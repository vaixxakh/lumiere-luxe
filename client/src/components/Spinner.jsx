import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-300 border-t-yellow-500 rounded-full"
      />
    </div>
  );
};

export default Spinner;
