import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Orders.css';
import { API_URL } from "../../../../configs/varibles";

function OrderList() {
    const [ordersList, setOrdersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ordersPerPage = 5;

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) throw new Error("Không thể lấy danh sách đơn hàng");
            const data = await response.json();
            setOrdersList(data.orders);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    const confirmOrder = async (orderId) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Không thể xác nhận đơn hàng");

            const updatedOrder = await response.json();

            setOrdersList((prevOrders) =>
                prevOrders.map((order) =>
                    order.orders_id === orderId ? { ...order, order_status: updatedOrder.order_status } : order
                )
            );
            alert("Đơn hàng đã được xác nhận!");
        } catch (error) {
            console.error("Lỗi khi xác nhận đơn hàng:", error);
            alert("Không thể xác nhận đơn hàng. Vui lòng thử lại.");
        }
    };
    const cancelOrder = async (orderId) => {
        const order = ordersList.find(order => order.orders_id === orderId);
        if (order && order.order_status !== 'Chờ xử lý') {
            alert('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xử lý".');
            return;
        }
        const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
        if (!confirmCancel) {
            return;
        }
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error("Không thể hủy đơn hàng");
            alert("Đơn hàng đã được hủy thành công!");
            fetchOrders();
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

    useEffect(() => {
        fetchOrders();
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = ordersList.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(ordersList.length / ordersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="table-orders">
            <h2 className="text-3xl pb-4">Danh sách đơn hàng</h2>
            <form className="search-flex-orders" role="search">
                <input className="form-control-search-orders" type="search" placeholder="Tìm kiếm đơn hàng..." aria-label="Search" />
                <button className="search-btn-orders" type="submit">Tìm kiếm</button>
            </form>
            <table id="example" className="table table-hover">
                <thead>
                    <tr>
                        <th className="w-8 text-center">ID đơn hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái đơn hàng</th>
                        <th>Ngày thanh toán</th>
                        <th>Phương thức thanh toán</th>
                        <th>Chi tiết</th>
                        <th style={{ width: '400px', textAlign: 'center' }}>Công cụ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.orders_id}>
                            <td>{order.orders_id}</td>
                            <td>{new Date(order.order_date).toLocaleDateString()}</td>
                            <td>{order.total_price.toLocaleString('vi-VN')} VND</td>
                            <td>{order.order_status}</td>
                            <td>{order.payment_date ? new Date(order.payment_date).toLocaleDateString() : "Chưa thanh toán"}</td>
                            <td>{order.payment_method}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openModal(order)}>Xem</button>
                            </td>
                            <td>
                                {order.order_status === "Chờ xử lý" ? (
                                    <button
                                        className="confirm-btn"
                                        onClick={() => confirmOrder(order.orders_id)}
                                    >
                                        Xác nhận
                                    </button>
                                ) : (
                                    <Link to={`/admin/orderslist/edit/${order.orders_id}`} className="edit-btn">Cập nhật</Link>
                                )}
                                {order.order_status === "Chờ xử lý" ? (
                                    <button
                                        className="cancel-btn"
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
                    ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Trang trước</button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Trang sau</button>
            </div>

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
    );
}

export default OrderList;
