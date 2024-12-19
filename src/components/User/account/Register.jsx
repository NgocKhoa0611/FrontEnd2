import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../configs/varibles";

const Register = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .required("Vui lòng nhập tên"),
      phone: Yup.string()
        .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng nhập mật khẩu xác nhận"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          name: values.name,
          phone: values.phone,
          address: values.address,
          email: values.email,
          password: values.password,
        });
        setError(null);
        setSuccess(true);
      } catch (error) {
        if (error.response && error.response.data.message === "Email đã tồn tại") {
          setError("Email đã tồn tại. Vui lòng thử một email khác.");
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
        console.error("Đăng ký thất bại:", error);
      }
    },
  });

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Blob background */}
      <div className="absolute top-10 left-2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-8 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>

      {/* Form container */}
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://imgur.com/WRxNbZj.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            ĐĂNG KÝ TÀI KHOẢN
          </h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {/* Tên */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                placeholder="Tên"
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-sm text-red-600">{formik.errors.name}</div>
              ) : null}
            </div>

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                placeholder="Số điện thoại"
                id="phone"
                type="text"
                {...formik.getFieldProps("phone")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-sm text-red-600">{formik.errors.phone}</div>
              ) : null}
            </div>

            {/* Địa chỉ */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                placeholder="Địa chỉ"
                id="address"
                type="text"
                {...formik.getFieldProps("address")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-sm text-red-600">{formik.errors.address}</div>
              ) : null}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                placeholder="Email"
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-sm text-red-600">{formik.errors.email}</div>
              ) : null}
            </div>

            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                placeholder="Mật khẩu"
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-sm text-red-600">{formik.errors.password}</div>
              ) : null}
            </div>

            {/* Mật khẩu xác nhận */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Mật khẩu xác nhận
              </label>
              <input
                placeholder="Mật khẩu xác nhận"
                id="confirmPassword"
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-sm text-red-600">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm lg:text-base font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              Đăng ký
            </button>
          </form>

          {success && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-green-600">Đăng ký thành công!</h3>
                <p className="mt-2 text-gray-700">Tài khoản của bạn đã được tạo thành công.</p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
