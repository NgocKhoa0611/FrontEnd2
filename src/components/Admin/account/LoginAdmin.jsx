'use client';
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LoginAdmin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token exists in cookies
        const getTokenFromCookie = () => {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='));
            return cookie ? cookie.split('=')[1] : null;
        };

        const token = getTokenFromCookie();

        if (!token) {
            navigate('/admin/login'); // Redirect if no token
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
            password: Yup.string().required('Bắt buộc'),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const res = await axios.post(`http://localhost:8000/auth/login`, {
                    email: values.email,
                    password: values.password,
                });

                if (res.status !== 200) {
                    throw new Error(res.data.message || 'Đăng nhập thất bại');
                }

                const data = res.data;
                document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;

                const token = data.token;
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role === 1) {
                    window.location.href = 'http://localhost:5173/admin';
                } else {
                    window.location.href = '/admin/login';
                }
            } catch (error) {
                const status = error.response?.status;
                if (status === 403) {
                    setFieldError('general', 'Tài khoản chưa được xác nhận. Vui lòng kiểm tra email.');
                } else {
                    setFieldError('general', error.response?.data?.message || error.message);
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="relative h-screen bg-gradient-to-r from-white to-blue-200 overflow-hidden">
            <div className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://imgur.com/WRxNbZj.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        ĐĂNG NHẬP
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formik.errors.general && (
                                <div className="text-red-600 text-sm text-center">{formik.errors.general}</div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        placeholder="Email"
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
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="mt-1">
                                    <input
                                        placeholder="Mật khẩu"
                                        id="password"
                                        type="password"
                                        {...formik.getFieldProps("password")}
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-sm text-red-600">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/forgot-password">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Đăng nhập
                            </button>
                            <div className="flex items-center justify-center">
                                <div className="text-sm">
                                    Bạn chưa có tài khoản?{" "}
                                    <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/signup">
                                        Đăng ký ngay
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
