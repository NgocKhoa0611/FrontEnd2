import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    emailjs
      .sendForm(
        "service_zajfqos", // Service ID của bạn
        "template_77jcf8y", // Template ID của bạn
        e.target, // Gửi form
        "lDMI9mtsBRTK-joT6" // Public key của bạn
      )
      .then(
        () => {
          setLoading(false);
          setMessageSent(true);
          e.target.reset(); // Reset form sau khi gửi
        },
        (error) => {
          setLoading(false);
          console.error("Error sending email:", error);
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      );
  };
  

  return (
    <div className="bg-gray-100 py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Liên hệ với chúng tôi
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng gửi thông tin cho chúng tôi qua mẫu dưới đây. Chúng tôi sẽ phản hồi sớm nhất!
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
          <label htmlFor="to_name" className="block text-sm font-medium text-gray-700">
            Tên người nhận
          </label>
          <input
            type="text"
            name="to_name"
            id="to_name"
            placeholder="Nhập tên người nhận"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email của bạn
            </label>
            <input
              type="email"
              name="user_email"
              id="email"
              placeholder="Nhập email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Tin nhắn
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              placeholder="Nội dung tin nhắn"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi ngay"}
            </button>
          </div>
          {messageSent && (
            <p className="text-green-600 text-center mt-4">
              Tin nhắn đã được gửi thành công! Cảm ơn bạn đã liên hệ với chúng tôi.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
