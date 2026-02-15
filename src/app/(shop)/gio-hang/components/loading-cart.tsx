import React from "react";

type Props = {};

const LoadingCart = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    </div>
  );
};

export default LoadingCart;
