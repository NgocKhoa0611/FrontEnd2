import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../configs/varibles";

const Account = () => {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("orders");
  const [newAvatar, setNewAvatar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) {
      fetchUser();
      fetchOrderHistory();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setUser(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const response = await axios.get(`${API_URL}/orders/${userId}`, { withCredentials: true });
      setOrders(response.data.order);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (newAvatar) {
        formDataToSend.append("avatar", newAvatar);
      }
      console.log(formDataToSend);
      await axios.put(`${API_URL}/user/${userId}`, formDataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });

      alert("Cập nhật thành công!");
      fetchUser(); // Reload user data after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    const order = orders.find(order => order.orders_id === orderId);
    if (order && order.order_status !== 'Chờ xử lý') {
      alert('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xử lý".');
      return;
    }

    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel_user`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error("Không thể hủy đơn hàng");
      alert("Đơn hàng đã được hủy thành công!");
      fetchOrderHistory();
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 border-r p-6 bg-gray-50">
            <div className="flex flex-col items-center mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeAvatar}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <img
                  src={user ? `${API_URL}/avatar/${user.avatar || "default-avatar.jpg"}` : `${API_URL}/avatar/default-avatar.jpg`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full shadow-lg mb-4 cursor-pointer"
                />
              </label>
              <p className="text-lg font-semibold text-gray-800">{user?.name || "Không có tên"}</p>
              <p className="text-sm text-gray-500">{user?.email || "N/A"}</p>
            </div>
            <ul className="space-y-6">
              <li>
                <button
                  onClick={() => setSelectedTab("account")}
                  className={`text-[#0f3460] hover:text-[#072344] font-semibold p-2 rounded-md transition duration-300 w-full
                    ${selectedTab === "account" ? "bg-blue-100 text-blue-700" : "text-gray-600"}`}
                >
                  Thông tin tài khoản
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("orders")}
                  className={`text-[#0f3460] hover:text-[#072344] font-semibold p-2 rounded-md transition duration-300 w-full
                    ${selectedTab === "orders" ? "bg-blue-100 text-blue-700" : "text-gray-600"}`}
                >
                  Lịch sử đơn hàng
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 p-8">
            {/* Thông tin tài khoản */}
            {selectedTab === "account" && (
              <div id="account-info" className="transition-all duration-300 ease-in-out opacity-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="text"
                      id="phone"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      id="address"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      className="w-full mt-4 bg-[#0f3460] hover:bg-[#072344] text-white p-2 rounded-md"
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lịch sử đơn hàng */}
            {selectedTab === "orders" && (
              <div id="order-history" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Lịch sử đơn hàng</h2>
                <div className="table-container">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left">
                        <th className="px-2 py-2 font-semibold text-sm text-gray-700">Mã Đơn Hàng</th>
                        <th className="px-4 py-2 font-semibold text-sm text-gray-700">Ngày Đặt</th>
                        <th className="px-4 py-2 font-semibold text-sm text-gray-700">Trạng Thái</th>
                        <th className="px-4 py-2 font-semibold text-sm text-gray-700">Hình thức thanh toán</th>
                        <th className="px-4 py-2 font-semibold text-sm text-gray-700">Chi tiết đơn hàng</th>
                        <th className="px-4 py-2 font-semibold text-sm text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map(order => (
                          <tr key={order.orders_id} className="border-b">
                            <td className="px-2 py-1 w-20">{order.orders_id}</td>
                            <td className="px-2 py-1 w-25">
                              {new Date(order.order_date).toLocaleString('vi-VN', {
                                timeZone: 'UTC',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })}
                            </td>
                            <td className="px-4 py-2">{order.order_status}</td>
                            <td className="px-4 py-2">{order.payment_method}</td>
                            <td>
                              <button className="edit-btn" onClick={() => openModal(order)}>Xem</button>
                            </td>
                            <td>
                              {order.order_status === "Chờ xử lý" ? (
                                <button
                                  className="cancel-btn text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                                  onClick={() => cancelOrder(order.orders_id)}
                                >
                                  Hủy đơn
                                </button>
                              ) : (
                                <button
                                  className="cancel-btn text-gray-500 bg-gray-200 px-3 py-1 rounded cursor-not-allowed"
                                  disabled
                                >
                                  Hủy đơn
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4">Không có đơn hàng nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal for Order Details */}
            {modalOpen && selectedOrder && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="text-lg font-bold mt-4">Chi tiết đơn hàng</h3>
                  <table className="table-auto w-full border border-gray-200 mt-2">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">Mã sản phẩm</th>
                        <th className="px-4 py-2">Hình ảnh</th>
                        <th className="px-4 py-2">Màu sắc</th>
                        <th className="px-4 py-2">Kích cỡ</th>
                        <th className="px-4 py-2">Số lượng</th>
                        <th className="px-4 py-2">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderDetail.map((detail) => (
                        <tr key={detail.order_detail_id} className="border-t">
                          <td className="px-4 py-2">{detail.productDetail.product_detail_id}</td>
                          <td className="px-4 py-2 flex justify-center items-center">
                            <img
                              src={`${API_URL}/img/${detail.productDetail.productImage.img_url}`}
                              alt="Product"
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="px-4 py-2">{detail.productDetail.color.color_name}</td>
                          <td className="px-4 py-2">{detail.productDetail.size.size_name}</td>
                          <td className="px-4 py-2">{detail.quantity}</td>
                          <td className="px-4 py-2">{detail.total_amount.toLocaleString('vi-VN')} VND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={closeModal} className="close-btn">Đóng</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
