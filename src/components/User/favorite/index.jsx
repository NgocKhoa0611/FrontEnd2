import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { API_URL } from "../../../../configs/varibles";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Product from "../ui/Product"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]); // State to store favorites
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("Bạn cần phải đăng nhập để xem yêu thích!");
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      const userId = payload.id; // Assuming 'id' is the key for the user_id

      if (!userId) {
        alert("Không tìm thấy thông tin người dùng!");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/favorite`, { params: { user_id: userId } });

        // Kiểm tra xem dữ liệu trả về có đúng theo alias không
        if (response.data && response.data.map) {
          setFavorites(response.data); // Set the favorites to the state
        } else {
          toast.error("Dữ liệu yêu thích không hợp lệ.");
        }
      } catch (error) {
        toast.error("Có lỗi khi lấy danh sách yêu thích");
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      alert("Bạn cần phải đăng nhập để xóa sản phẩm yêu thích!");
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    try {
      await axios.delete(`${API_URL}/favorite/${productId}`, {
        data: { user_id: userId, product_id: productId },
      });

      toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích");

      // Cập nhật lại danh sách yêu thích sau khi xóa
      setFavorites(favorites.filter((item) => item.product.product_id !== productId));
    } catch (error) {
      toast.error("Có lỗi khi xóa sản phẩm yêu thích");
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của tôi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(( favorite) => (

          <div key={favorite.product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Hiển thị ảnh sản phẩm bằng thẻ <img> */}
            {favorite?.product?.detail?.find(item => item.is_primary)?.productImage?.img_url ? (
              <img
                src={`${API_URL}/img/${favorite?.product?.detail.find(item => item.is_primary)?.productImage?.img_url}`}
                alt={favorite?.product?.product_name}
                className="w-full h-48 object-contain"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex justify-center items-center">Không có ảnh</div>
            )}


            <div className="p-4">
              {/* Tên sản phẩm */}
                <Link to={`/product/${favorite?.product?.product_id}`}>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-1">{favorite.product.product_name}</h2>
                </Link>
              {/* Giá sản phẩm */}
              <p className="text-gray-600">
                {favorite.product.price_promotion > 0 ? (
                  <span className="line-through text-red-500">
                    {favorite.product.price.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}đ
                  </span>
                ) : (
                  ""
                )}
                <span className="ml-2 text-xl font-semibold text-green-600">
                  {favorite.product.price_promotion > 0
                    ? favorite.product.price_promotion.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
                    : favorite.product.price.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}đ
                </span>
              </p>

              {/* Mô tả sản phẩm */}
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {favorite.product.detail[0]?.description}
            </p>


              {/* Nút Xóa khỏi yêu thích */}
              <button
                onClick={() => handleRemoveFavorite(favorite.product.product_id)}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Xóa khỏi yêu thích
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FavoritesPage;
