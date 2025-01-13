'use client';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if email or token are missing
    if (!email || !token) {
        return (
            <div className="relative h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-white p-8 shadow rounded-lg">
                    <p className="text-red-600 text-center">Thiếu email hoặc token. Vui lòng kiểm tra lại liên kết trong email.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear error before each submission

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            setLoading(true); // Start loading
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                email,
                token,
                password,
            });

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Có lỗi xảy ra');
            } else {
                setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="relative h-screen bg-gray-50 overflow-hidden">
            {/* Blob Background */}
            <div className="absolute top-10 left-5 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>

            <div className="flex min-h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://imgur.com/WRxNbZj.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        ĐẶT LẠI MẬT KHẨU
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        {success ? (
                            <div className="text-green-600 text-center font-medium">
                                Đặt lại mật khẩu thành công! Đang chuyển hướng...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="text-red-600 text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 shadow-sm sm:text-sm"
                                            aria-label="Email"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu mới
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            aria-describedby="password-help"
                                        />
                                        <p id="password-help" className="text-xs text-gray-500">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Xác nhận mật khẩu"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            aria-describedby="confirm-password-help"
                                        />
                                        <p id="confirm-password-help" className="text-xs text-gray-500">Hãy chắc chắn mật khẩu khớp với mật khẩu mới.</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex w-full justify-center rounded-md bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;