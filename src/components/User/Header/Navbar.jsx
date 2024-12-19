import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../configs/varibles";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}/category`),
          axios.get(`${API_URL}/product`)
        ]);

        const groupedCategories = categoriesResponse.data.reduce((acc, item) => {
          if (item.is_hidden) return acc;
          if (!acc[item.category_parent_id]) {
            acc[item.category_parent_id] = [];
          }
          acc[item.category_parent_id].push({
            name: item.category_name,
            id: item.category_id,
          });
          return acc;
        }, {});

        setCategories(groupedCategories);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          {!loading && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#0f3460]">
                Trang chủ
              </Link>

              <div className="relative group">
                <Link to="/products" className="text-gray-700 hover:text-[#0f3460]">
                  Sản phẩm
                </Link>
              </div>

              {Object.keys(categories).map((parentId) => (
                <div key={parentId} className="relative group">
                  <Link
                    to={`/category/parent/${parentId}`}
                    className="text-gray-700 hover:text-[#0f3460]"
                  >
                    {parentId === "1"
                      ? "Áo"
                      : parentId === "2"
                        ? "Quần"
                        : parentId === "3"
                          ? "Phụ kiện"
                          : parentId === "4"
                            ? "Giày"
                            : "Khác"}
                  </Link>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    {categories[parentId].map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link to="/contact" className="text-gray-700 hover:text-[#0f3460]">
                Liên hệ
              </Link>
            </div>
          )}

          {/* Mobile Navigation */}
          <div
            className={`${mobileMenuOpen ? "block" : "hidden"
              } md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Trang chủ
              </Link>

              <div className="relative">
                <Link
                  to="/products"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Sản phẩm
                </Link>
              </div>

              {Object.keys(categories).map((parentId) => (
                <div key={parentId}>
                  <Link
                    to={`/category/parent/${parentId}`}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {parentId === "1"
                      ? "Áo"
                      : parentId === "2"
                        ? "Quần"
                        : parentId === "3"
                          ? "Phụ kiện"
                          : parentId === "4"
                            ? "Giày"
                            : "Khác"}
                  </Link>
                  <div className="pl-4">
                    {categories[parentId].map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

