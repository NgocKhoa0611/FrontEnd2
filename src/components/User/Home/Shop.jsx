import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../ui/Product";
import axios from "axios";
import { API_URL } from "../../../../configs/varibles";
import hot from "../../../../public/images/promotional.png";

const Shop = () => {
  const [shopItems, setShopItems] = useState([]);
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
    const fetchHotProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/feature`);
        setShopItems(response.data);
      } catch (error) {
        console.error("Error fetching hot products:", error);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <section className="py-8 bg-gray-50 rounded-lg">
      <div className="container mx-auto p-2 px-3">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={hot} alt="Promotional" className="w-8 h-8" />
            <h2 className="text-xl md:text-2xl font-bold">Sản phẩm nổi bật</h2>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm md:text-base">Xem tất cả</span>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>

        <div>
          <Slider {...settings}>
            {shopItems.map((item, index) => (
              <div key={index} className="px-2">
                <Product shopItems={item} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};
export default Shop;
