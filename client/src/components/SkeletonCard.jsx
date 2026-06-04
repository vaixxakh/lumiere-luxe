import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-200 w-full"></div>

      {/* Content Skeleton */}
      <div className="p-5 flex-grow space-y-3.5">
        {/* Category Badge */}
        <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>

        {/* Title Lines */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-11/12"></div>
          <div className="h-4 bg-slate-200 rounded-md w-4/5"></div>
        </div>

        {/* Description Lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-100 rounded-md w-full"></div>
          <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
        </div>

        {/* Bottom Rating and Price */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="h-6 bg-slate-200 rounded-lg w-12"></div>
          <div className="h-5 bg-slate-200 rounded-lg w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
