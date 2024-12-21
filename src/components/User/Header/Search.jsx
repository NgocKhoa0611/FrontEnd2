import { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../../../../redux/slices/cartslice";
import { debounce } from "lodash";
import { API_URL } from "../../../../configs/varibles";

const Search = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const searchResultsRef = useRef(null);

  const cartDetail = useSelector((state) => state.cart.items?.cart?.cartDetail);
  const itemCount = cartDetail ? cartDetail.length : 0;

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      setIsLoggedIn(true);
      fetchUser();
      getCart();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true,
      });
      dispatch(setCartItems(response.data));
    } catch (error) {
      console.error("Error fetching cart:", error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const debouncedSearch = debounce(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/product/search?name=${term.trim()}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(e.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const resetSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link className="w-40 md:w-48" to="/" onClick={resetSearchTerm}>
            <img src={logo} alt="Logo" className="w-full h-auto" />
          </Link>

          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Search Results */}
            {searchTerm && (
              <div
                ref={searchResultsRef}
                className="absolute w-full bg-white shadow-md rounded-lg mt-2 max-h-96 overflow-y-auto z-50"
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex items-center gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <Link
                        to={`/product/${product.product_id}`}
                        className="flex items-center w-full"
                        onClick={resetSearchTerm}
                      >
                        <img
                          src={`${API_URL}/img/${product.detail[0]?.productImage?.img_url}`}
                          alt={product.product_name}
                          className="w-16 h-20 md:w-24 md:h-28 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <h1 className="text-base md:text-xl line-clamp-2">
                            {product.product_name}
                          </h1>
                          <div className="mt-2">
                            <span className="text-red-500 font-bold">
                              {product.price}₫
                            </span>
                            {product.original_price && (
                              <span className="text-gray-500 line-through ml-2 text-sm">
                                {product.original_price}₫
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Không có sản phẩm nào.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            {isLoggedIn && user ? (
              <div className="relative">
                <img
                  src={
                    user.avatar
                      ? `${API_URL}/avatar/${user.avatar}`
                      : `${API_URL}/img/default-avatar.png`
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg min-w-[180px] py-2 z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin tài khoản
                    </Link>
                    {/* <Link
                      to="/admin/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Trang quản trị
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <i className="fa fa-user text-xl hover:text-blue-600"></i>
              </Link>
            )}

            <Link to="/favorite">
              <i className="fa fa-heart text-xl hover:text-red-600"></i>
            </Link>

            <Link to="/cart" className="relative">
              <i className="fa fa-shopping-bag text-xl hover:text-green-600"></i>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Search;
