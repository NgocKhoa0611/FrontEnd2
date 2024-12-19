import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios
import './Orders.css';
import { API_URL } from "../../../../configs/varibles";

function OrdersEdit() {
    let { id } = useParams(); // Lấy ID đơn hàng từ URL
    const [orderStatus, setOrderStatus] = useState(""); // Trạng thái đơn hàng
    const [paymentDate, setPaymentDate] = useState(""); // Ngày thanh toán
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Lấy thông tin đơn hàng theo ID
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                console.log(`Fetching order with ID: ${id}`);
                const response = await axios.get(`${API_URL}/orders/${id}`);
                console.log("Order data fetched:", response.data);
                if (response.data) {
                    setOrderStatus(response.data.order.order_status || "");
                    setPaymentDate(response.data.order.payment_date || "");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                alert("Không thể tải dữ liệu đơn hàng");
            }
        };
        fetchOrder();
    }, [id]);


    // Cập nhật trạng thái đơn hàng và ngày thanh toán
    const submitOrderStatus = async () => {
        try {
            if (!orderStatus) {
                setErrorMessage("Vui lòng chọn trạng thái đơn hàng.");
                return;
            }
            const response = await axios.put(`${API_URL}/orders/${id}/status`, {
                order_status: orderStatus,
                payment_date: paymentDate, // Send payment date in the request
            });
            alert("Đã cập nhật trạng thái đơn hàng");
            navigate("/admin/orderslist"); // Chuyển về danh sách đơn hàng
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", errorMessage);
            alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
        }
    };

    return (
        <form className="frmeditorders" id="frmeditorders" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-3xl pb-4">Cập nhật đơn hàng</h2>
            <div className="col">
                <label>Trạng thái đơn hàng:</label>
                <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="form-control"
                >
                    <option value="" disabled>Chọn trạng thái</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
            </div>
            <div className="col">
                <label>Ngày thanh toán:</label>
                <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <button className="edit-btn-orders" type="button" onClick={submitOrderStatus}>
                    Cập nhật
                </button>
                &nbsp;
                <button className="btn-orders-list" onClick={() => navigate("/admin/orderslist")}>
                    Quay lại danh sách
                </button>
            </div>
        </form>
    );
}

export default OrdersEdit;
