import React from 'react';

const FailurePage = () => {
    return (
        <div className="bg-gray-100 h-screen">
            <div className="bg-white p-6 md:mx-auto">
                <svg viewBox="0 0 24 24" className="text-red-600 w-16 h-16 mx-auto my-6">
                    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.657 16.657a1 1 0 01-1.414 0L12 12.414l-4.243 4.243a1 1 0 01-1.414-1.414L10.586 11 6.343 6.757a1 1 0 011.414-1.414L12 9.586l4.243-4.243a1 1 0 111.414 1.414L13.414 11l4.243 4.243a1 1 0 010 1.414z" />
                </svg>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Thanh toán không thành công!
                    </h3>
                    <p className="text-gray-600 my-2">Rất tiếc, đơn hàng của bạn không thể được xử lý.</p>
                    <p>Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.</p>
                    <div className="py-10 text-center">
                        <a href="/" className="px-12 bg-red-600 hover:bg-red-500 text-white font-semibold py-3">
                            Quay lại
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FailurePage;
