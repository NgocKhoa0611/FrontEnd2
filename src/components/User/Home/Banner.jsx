import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/images/banner_home.jpg",
  "/images/banner_home1.jpg",
  "/images/banner_home2.jpg",
];

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="w-full overflow-hidden mb-5">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="relative">
            <div className="aspect-[16/9] sm:aspect-[21/9]">
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
