import Product from "../ui/Product";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

export default function Category() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/product/parent/${id}`)
      .then((response) => {
        const visibleProducts = response.data.filter(product => !product.is_hidden);
        setProducts(visibleProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [id]);

  if ((products.length === 0 && !loading)) {
    return <p>Danh mục này hiện không có sản phẩm.</p>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-8 py-10 sm:px-10 sm:py-20 lg:max-w-screen-2xl lg:px-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Danh mục:
          {(() => {
            if (id === "1") {
              return " Áo";
            } else if (id === "2") {
              return " Quần";
            } else if (id === "3") {
              return " Phụ kiện";
            } else if (id === "4") {
              return " Giày";
            } else {
              return "Khác";
            }
          })()}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <Product key={index} shopItems={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
