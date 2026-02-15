import React from "react";
import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <Image src="/images/logo1.png" alt="Logo" width={90} height={90} />

            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              AZ Shop là dự án demo thương mại điện tử tập trung vào các sản
              phẩm Apple, tích hợp đầy đủ tính năng như hiển thị, tìm kiếm sản
              phẩm, giỏ hàng và trang quản trị, cùng giao diện hiện đại, tương
              thích đa thiết bị.
            </p>
          </div>

          {/* Developer Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 tracking-wider">Liên hệ</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <i className="bi bi-envelope"></i>{" "}
                <a
                  href="mailto:trongnhanbro@gmail.com"
                  className="text-sm hover:text-blue-600 transition-colors"
                >
                  trongnhanbro@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <i className="bi bi-geo-alt"></i>
                <span className="text-sm">Cần Thơ, Việt Nam</span>
              </div>

              {/* Social Links */}
              <div className="">
                <Link
                  href="https://github.com/trong-nhan-tran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <i className="bi-github"></i>
                  <span className="text-sm">GitHub</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AZ Shop. Dự án cá nhân của Tran Nhan.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  NextJS
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  TailwindCSS
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Prisma
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Supabase
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
