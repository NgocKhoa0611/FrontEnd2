import Product from "../ui/Product";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

export default function Category() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}/category/${id}`),
          axios.get(`${API_URL}/product/category/${id}`)
        ]);

        setCategoryName(categoryResponse.data.category_name);
        setIsHidden(categoryResponse.data.is_hidden);

        const visibleProducts = productsResponse.data.filter(product => !product.is_hidden);
        setProducts(visibleProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-600">Danh mục này hiện không có sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Danh mục: {categoryName || 'Đang tải...'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {products.length} sản phẩm
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <div key={product.product_id} className="transform transition duration-200 hover:scale-105">
            <Product shopItems={product} />
          </div>
        ))}
      </div>
    </div>
  );
}