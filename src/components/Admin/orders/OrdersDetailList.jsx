import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Orders.css';
import { API_URL } from "../../../../configs/varibles";

function OrderDetailList() {
    const [ordersList, setOrdersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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
            <h2 class="text-3xl pb-4">Danh sách đơn hàng</h2>
            <form className="search-flex-orders" role="search">
                <input className="form-control-search-orders" type="search" placeholder="Tìm kiếm đơn hàng..." aria-label="Search" />
                <button className="search-btn-orders" type="submit">Tìm kiếm</button>
            </form>
            <table id="example" className="table table-hover">
                <thead>
                    <tr>
                        <th className="w-8 text-center">ID đơn hàng</th>
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Số lượng</th>
                        <th>Chi tiết</th>
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
        </div>
    );
}

export default OrderDetailList;
