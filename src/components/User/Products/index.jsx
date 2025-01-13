import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from "../ui/Product";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Loading from "../ui/Loading";
import { API_URL } from "../../../../configs/varibles";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [priceOption, setPriceOption] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(`${API_URL}/product`),
          axios.get(`${API_URL}/category`),
        ]);

        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = [...products]
    .filter((product) => {
      const isCategoryMatch = selectedCategory ? product.category_id === selectedCategory : true;
      const isNotHidden = product.is_hidden === 0;
      return isCategoryMatch && isNotHidden;
    })
    .sort((a, b) => {
      const priceA = a.price_promotion || a.price;
      const priceB = b.price_promotion || b.price;
      if (priceOption === "low") {
        return priceA - priceB;
      } else if (priceOption === "high") {
        return priceB - priceA;
      }
      return 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading />;
  }

  const FilterSection = () => (
    <div className={`filter-container bg-white p-4 rounded-lg shadow-md ${showFilters ? 'block' : 'hidden md:block'}`}>
      <h3 className="text-xl font-semibold mb-6">Lọc Sản phẩm</h3>

      <div className="space-y-6">
        {/* Category Filter */}
        <div className="category-filter">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="price-filter">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Giá:
          </label>
          <select
            id="price"
            value={priceOption}
            onChange={(e) => {
              setPriceOption(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="low">Giá thấp đến cao</option>
            <option value="high">Giá cao đến thấp</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden w-full mb-4 p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
      >
        <i className="fas fa-filter"></i>
        {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="md:w-1/4">
          <FilterSection />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tất cả Sản phẩm</h2>
            <span className="text-gray-600">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <Product key={product.product_id} shopItems={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-100'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;