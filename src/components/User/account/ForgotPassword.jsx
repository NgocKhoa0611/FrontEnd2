'use client';
import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';  // Import Zod
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: (values) => {
            // Định nghĩa schema Zod cho form validation
            const schema = z.object({
                email: z.string().email('Email không hợp lệ').nonempty('Bắt buộc'),
            });

            // Dùng Zod để validate dữ liệu
            const result = schema.safeParse(values);
            if (!result.success) {
                // Chuyển đổi lỗi từ Zod thành lỗi của formik
                const errors = {};
                result.error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                return errors;
            }
            return {};
        },
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                    email: values.email,
                });

                if (response.status === 200) {
                    alert("Liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
                } else {
                    throw new Error(response.data.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
                }
            } catch (error) {
                setFieldError(
                    'general',
                    error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="relative h-screen bg-gray-50 overflow-hidden">
            {/* Blob Background */}
            <div className="absolute top-10 left-5 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>

            {/* Main Content */}
            <div className="flex min-h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://imgur.com/WRxNbZj.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        QUÊN MẬT KHẨU
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formik.errors.general && (
                                <div className="text-red-600 text-sm text-center">
                                    {formik.errors.general}
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        placeholder="Nhập email"
                                        id="email"
                                        type="email"
                                        {...formik.getFieldProps("email")}
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-sm text-red-600">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;