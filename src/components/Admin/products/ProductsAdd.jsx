import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function ProductAdd() {
  const [product, setProduct] = useState({
    product_name: '',
    category_id: '',
    price: '',
    price_promotion: 0,
    img_url: ''
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách danh mục
  useEffect(() => {
    axios.get(`${API_URL}/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        alert("Có lỗi xảy ra khi tải danh mục. Vui lòng thử lại sau.");
      });
  }, []);

  const submitDuLieu = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/product`, product)
      .then((response) => {
        alert("Đã thêm sản phẩm thành công!");
        setProduct({
          product_name: '',
          category_id: '',
          price: '',
          price_promotion: 0,
        });
        navigate('/admin/productlist');
      })
      .catch((error) => {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại!");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'price' || name === 'price_promotion'
        ? (value === '' ? 0 : parseInt(value, 10))
        : value
    }));
  };

  return (
    <form id="frmaddproduct" className="frmaddproduct" onSubmit={submitDuLieu}>
      <h2 class="text-3xl pb-4">Thêm sản phẩm</h2>
      <div className='col'>Tên sản phẩm:
        <input
          value={product.product_name}
          type="text"
          className="form-control"
          name="product_name"
          onChange={handleChange}
          required
        />
      </div>
      <div className='col'>Danh mục:
        <select
          className="form-control"
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map(category => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      <div className='col'>Giá:
        <input
          value={product.price}
          type="number"
          className="form-control"
          name="price"
          onChange={handleChange}
          required
        />
      </div>
      <div className='col'>Giá khuyến mãi:
        <input
          value={product.price_promotion}
          type="number"
          className="form-control"
          name="price_promotion"
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="mb-3">
        <button className="add-btn-products" type="submit">Thêm sản phẩm</button> &nbsp;
        <Link to={`/admin/productlist`} className="btn-products-list">Danh sách sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductAdd;
