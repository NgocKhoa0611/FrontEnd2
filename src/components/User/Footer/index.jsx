const Footer = () => {
  return (
    <>
      <footer className="bg-[#0f3460] text-white py-8">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {/* Box 1 */}
          <div className="box">
            <h1 className="text-3xl font-bold mb-4">Fashionverse</h1>
            <p className="text-sm mb-4">
              Fashionverse – Thế giới thời trang dành cho bạn. Chúng tôi cam kết mang đến những sản phẩm chất lượng, phong cách, và dịch vụ tốt nhất dành cho khách hàng.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="fa-brands fa-google-play text-lg"></i>
                <span className="text-sm">Google Play</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-brands fa-app-store-ios text-lg"></i>
                <span className="text-sm">App Store</span>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="box">
            <h2 className="text-xl font-semibold mb-2">Về Chúng Tôi</h2>
            <ul className="text-sm space-y-2">
              <li>Cơ hội nghề nghiệp</li>
              <li>Hệ thống cửa hàng</li>
              <li>Chính sách của chúng tôi</li>
              <li>Điều khoản & Điều kiện</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>

          {/* Box 3 */}
          <div className="box">
            <h2 className="text-xl font-semibold mb-2">Hỗ Trợ Khách Hàng</h2>
            <ul className="text-sm space-y-2">
              <li>Trung tâm trợ giúp</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Theo dõi đơn hàng</li>
              <li>Mua hàng doanh nghiệp</li>
              <li>Chính sách đổi trả</li>
            </ul>
          </div>

          {/* Box 4 */}
          <div className="box">
            <h2 className="text-xl font-semibold mb-2">Liên Hệ</h2>
            <ul className="text-sm space-y-2">
              <li>123 Quang Trung, P.10, Q. Gò Vấp, TP Hồ Chí Minh</li>
              <li>Email: fashionverse.support@gmail.com</li>
              <li>Điện thoại: +028 7303 1234</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
