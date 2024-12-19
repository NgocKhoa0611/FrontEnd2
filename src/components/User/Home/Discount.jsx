import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Product from "../ui/Product";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../configs/varibles";

const Discount = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/promotion`);
        setDiscountedProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return (
    <section className="py-8 bg-gray-50 rounded-lg">
      <div className="container mx-auto p-2 px-3">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img
              src="https://img.icons8.com/windows/32/fa314a/gift.png"
              alt="Discount Icon"
              className="w-8 h-8"
            />
            <h2 className="text-xl md:text-2xl font-bold">Sản phẩm giảm giá</h2>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Link to="/products" className="text-gray-700 hover:text-[#0f3460]">
              <span className="text-sm md:text-base">Xem tất cả</span>
            </Link>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div>
            <Slider {...settings}>
              {discountedProducts.length > 0 ? (
                discountedProducts.map((item, index) => (
                  <div key={item.id || index} className="px-2">
                    <Product shopItems={item} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">Không có sản phẩm giảm giá nào.</div>
              )}
            </Slider>
          </div>
        )}
      </div>
    </section>

  );
};
export default Discount;

