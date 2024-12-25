import React, { useState, useEffect } from "react";
import axios from "axios";
import '../products/DetailAdd.css'; 
import { API_URL } from "../../../../configs/varibles";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    detail: "",
    colorName: "",
    sizeName: "",
    quantity: 0,
    description: "",
    image: null,
    isFeatured: false,
    isHot: false,
    category_id: "",
    price: "",
    price_promotion: 0,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        alert("Có lỗi xảy ra khi tải danh mục. Vui lòng thử lại sau.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add logic to send formData to your API or handle it accordingly
    axios.post(`${API_URL}/product`, formData)
      .then((response) => {
        alert("Đã thêm sản phẩm thành công!");
        setFormData({
          id: "",
          detail: "",
          colorName: "",
          sizeName: "",
          quantity: 0,
          description: "",
          image: null,
          isFeatured: false,
          isHot: false,
          category_id: "",
          price: "",
          price_promotion: 0,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại!");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Thêm sản phẩm</h2>
      <div className="form-group">
        <label className="form-label">ID Chi tiết</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Tên màu</label>
        <input
          type="text"
          name="colorName"
          value={formData.colorName}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Tên kích cỡ</label>
        <input
          type="text"
          name="sizeName"
          value={formData.sizeName}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Số lượng</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
        ></textarea>
      </div>
      <div className="form-group">
        <label className="form-label">Hình ảnh</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Danh mục</label>
        <select
          className="form-input"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Giá</label>
        <input
          value={formData.price}
          type="number"
          name="price"
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Giá khuyến mãi</label>
        <input
          value={formData.price_promotion}
          type="number"
          name="price_promotion"
          onChange={handleChange}
          className="form-input"
          min="0"
        />
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="form-checkbox"
          id="isFeatured"
        />
        <label className="form-checkbox-label" htmlFor="isFeatured">
          isFeatured
        </label>
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          name="isHot"
          checked={formData.isHot}
          onChange={handleChange}
          className="form-checkbox"
          id="isHot"
        />
        <label className="form-checkbox-label" htmlFor="isHot">
          isHot
        </label>
      </div>
      <button type="submit" className="form-button">Thêm sản phẩm</button>
    </form>
  );
};

export default ProductForm;
