import React, { useState, useEffect } from "react";
import axios from "axios";

const VoucherComponent = () => {
    const [voucherCode, setVoucherCode] = useState(() => localStorage.getItem("voucherCode") || null); // Get voucher from localStorage
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer;
        if (loading && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [loading, countdown]);

    const handleShare = async () => {
        if (voucherCode) {
            setError("Bạn đã nhận được mã giảm giá. Hãy xóa mã để chia sẻ lại.");
            return;
        }

        setVoucherCode(null);
        setLoading(true);
        setError(null);
        setCountdown(5);

        // Share event on Facebook
        const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=yourWebsiteUrl";
        const newWindow = window.open(shareUrl, "_blank", "width=600,height=400");

        if (newWindow) newWindow.focus();

        // Send share info to the server after sharing
        setTimeout(async () => {
            try {
                // Get all vouchers
                const response = await axios.get(`http://localhost:8000/vouchers`);
                const vouchers = response.data; // Assuming the response returns a list of vouchers

                if (vouchers.length > 0) {
                    const randomVoucher = vouchers[Math.floor(Math.random() * vouchers.length)];
                    setVoucherCode(randomVoucher.code);
                    localStorage.setItem("voucherCode", randomVoucher.code); // Save voucher to localStorage
                } else {
                    setError("Không có voucher nào khả dụng.");
                }
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Lỗi khi lấy voucher. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }, 5000);
    };

    const handleReset = () => {
        setVoucherCode(null);
        localStorage.removeItem("voucherCode"); // Remove voucher from localStorage
        setError(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                    Chia sẻ Website để nhận voucher miễn phí!
                </h1>
                <p className="text-white text-lg font-medium">
                    Hãy tham gia ngay để không bỏ lỡ ưu đãi đặc biệt này!
                </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 text-center w-full max-w-2xl mb-8">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/888/888979.png"
                    alt="Gift"
                    className="w-24 h-24 mx-auto mb-4 animate-bounce"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Cơ hội nhận voucher giá trị cực khủng!
                </h2>
                <p className="text-gray-600">
                    Chia sẻ sự kiện này trên Facebook để nhận ngay voucher.
                    Voucher áp dụng trên mọi sản phẩm và dịch vụ.
                </p>
            </div>

            <div className="mb-8">
                <button
                    onClick={handleShare}
                    disabled={voucherCode}
                    className={`${
                        voucherCode
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-110"
                    } text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all`}
                >
                    {voucherCode ? "Bạn đã nhận mã" : "Chia sẻ ngay"}
                </button>
            </div>

            <div className="text-center">
                {loading && (
                    <p className="text-lg text-white font-semibold animate-pulse">
                        Đang xử lý... Vui lòng đợi! ({countdown} giây)
                    </p>
                )}
                {voucherCode && (
                    <div className="bg-green-100 text-green-700 py-3 px-6 rounded-lg mt-6 shadow-lg">
                        <h3 className="text-lg font-bold">Mã Voucher của bạn:</h3>
                        <p className="text-xl font-mono">{voucherCode}</p>
                        <button
                            onClick={handleReset}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                            Xóa mã
                        </button>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 py-3 px-6 rounded-lg mt-6 shadow-lg">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherComponent;
