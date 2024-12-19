import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Infor.css';

const Infor = () => {
    const [avatar, setAvatar] = useState('path-to-avatar/avatar.jpg');

    const formik = useFormik({
        initialValues: {
            name: 'Nguyễn Văn A',
            email: 'example@gmail.com',
            address: '123 Đường ABC, TP.HCM',
            phone: '0123456789',
            password: '',
            repassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Họ tên là bắt buộc.'),
            email: Yup.string()
                .email('Email không hợp lệ.')
                .required('Email là bắt buộc.'),
            address: Yup.string().required('Địa chỉ là bắt buộc.'),
            phone: Yup.string()
                .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa số.')
                .required('Số điện thoại là bắt buộc.'),
            password: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
                .required('Mật khẩu là bắt buộc.'),
            repassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp.')
                .required('Bạn cần nhập lại mật khẩu.'),
        }),
        onSubmit: (values) => {
            console.log('Submitted data:', values);
        },
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
        }
    };

    return (
        <div className="container mt-5 p-40">
            <div className="bg-[#0f3460] text-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl mx-auto">
                <div className="bg-[#0f3460] text-white text-center p-5">
                    <h2 className="text-2xl font-semibold">Thông tin tài khoản</h2>
                </div>
                <div className="p-5">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex items-start">
                            <div className="mr-5 text-center">
                                <img
                                    src={avatar}
                                    alt="Profile Picture"
                                    className="w-48 h-48 rounded-full object-cover border-4 border-[#0f3460] mb-3"
                                />
                                <input
                                    type="file"
                                    className="form-control-file mb-3"
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg shadow-md p-5">
                                {/* Họ tên */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block font-bold text-lg text-gray-700">Họ tên</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="name"
                                        id="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-sm">{formik.errors.name}</div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label htmlFor="email" className="block font-bold text-lg text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="email"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                    )}
                                </div>

                                {/* Địa chỉ */}
                                <div className="mb-4">
                                    <label htmlFor="address" className="block font-bold text-lg text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="address"
                                        id="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <div className="text-red-500 text-sm">{formik.errors.address}</div>
                                    )}
                                </div>

                                {/* Số điện thoại */}
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block font-bold text-lg text-gray-700">Điện thoại</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="phone"
                                        id="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <div className="text-red-500 text-sm">{formik.errors.phone}</div>
                                    )}
                                </div>

                                {/* Mật khẩu */}
                                <div className="mb-4">
                                    <label htmlFor="password" className="block font-bold text-lg text-gray-700">Đổi mật khẩu</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="password"
                                        id="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                    )}
                                </div>

                                {/* Nhập lại mật khẩu */}
                                <div className="mb-4">
                                    <label htmlFor="repassword" className="block font-bold text-lg text-gray-700">Nhập lại mật khẩu</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        name="repassword"
                                        id="repassword"
                                        value={formik.values.repassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.repassword && formik.errors.repassword && (
                                        <div className="text-red-500 text-sm">{formik.errors.repassword}</div>
                                    )}
                                </div>

                                {/* Nút Lưu */}
                                <button type="submit" className="w-full py-3 bg-[#0f3460] text-white font-semibold rounded-lg hover:bg-[#0f1e33]">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Infor;
