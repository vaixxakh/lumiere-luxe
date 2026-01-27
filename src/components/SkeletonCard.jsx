const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200  overflow-hidden shadow-sm animate-pulse">
      {/* Image */}
      <div className="h-48 sm:h-56 bg-gray-300"></div>

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>

        {/* Description */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>

        {/* Price & Rating */}
        <div className="flex justify-between items-center mt-3">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </div>

        {/* Buttons */}
        {/* <div className="h-9 bg-gray-300 rounded mt-4"></div>
        <div className="h-9 bg-gray-300 rounded"></div> */}
      </div>
    </div>
  );
};

export default ProductSkeleton;
