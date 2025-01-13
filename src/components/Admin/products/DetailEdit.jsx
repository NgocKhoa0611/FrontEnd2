import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function ProductEdit() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    product_id: '',
    color_id: '',
    size_id: '',
    quantity: '',
    description: '',
    isFeatured: 0,
    isHot: 0,
    is_primary: 0,
    is_hidden: 0,
  });
  const [colors, setColors] = useState([]); // Danh sách mã màu
  const [sizes, setSizes] = useState([]); // Danh sách kích thước

  useEffect(() => {
    // Lấy thông tin sản phẩm
    fetch(`${API_URL}/product/${id}`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        alert("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.");
      });

    // Lấy danh sách màu
    fetch(`${API_URL}/detail/color`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setColors(data);
      })
      .catch(error => {
        console.error('Error fetching colors:', error);
      });

    // Lấy danh sách kích thước
    fetch(`${API_URL}/detail/size`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setSizes(data);
      })
      .catch(error => {
        console.error('Error fetching sizes:', error);
      });
  }, [id]);

  const submitDuLieu = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/detail/update-detail/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product), // Gửi dữ liệu dưới dạng JSON
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("Response Error:", text);
            throw new Error("Server response was not ok");
          });
        }
        return res.json();
      })
      .then((data) => {
        alert("Đã cập nhật sản phẩm thành công!");
        navigate('/product');
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại!");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === 'isFeatured' || name === 'isHot' || name === 'is_primary' || name === 'is_hidden'
        ? parseInt(value) // Xử lý checkbox và boolean
        : value,
    }));
  };

  return (
    <form id="frmeditproduct" className="frmeditproduct" onSubmit={submitDuLieu}>
      <h2>Sửa sản phẩm</h2>
      <div className='col'>ID sản phẩm:
        <input value={product.product_id} type="text" className="form-control" readOnly />
      </div>
      <div className='col'>Mã màu:
        <select
          value={product.color_id}
          className="form-control"
          name="color_id"
          onChange={handleChange}
        >
          <option value="">Chọn mã màu</option>
          {colors.map(color => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name} (ID: {color.color_id})
            </option>
          ))}
        </select>
      </div>
      <div className='col'>Kích thước:
        <select
          value={product.size_id}
          className="form-control"
          name="size_id"
          onChange={handleChange}
        >
          <option value="">Chọn kích thước</option>
          {sizes.map(size => (
            <option key={size.size_id} value={size.size_id}>
              {size.size_name} (ID: {size.size_id})
            </option>
          ))}
        </select>
      </div>
      <div className='col'>Số lượng:
        <input
          value={product.quantity}
          type="number"
          className="form-control"
          name="quantity"
          onChange={handleChange}
        />
      </div>
      <div className='col'>Mô tả:
        <textarea
          value={product.description}
          className="form-control"
          name="description"
          onChange={handleChange}
        />
      </div>
      <div className='col'>Nổi bật:
        <select
          value={product.isFeatured}
          className="form-control"
          name="isFeatured"
          onChange={handleChange}
        >
          <option value="0">Không</option>
          <option value="1">Có</option>
        </select>
      </div>
      <div className='col'>Hot:
        <select
          value={product.isHot}
          className="form-control"
          name="isHot"
          onChange={handleChange}
        >
          <option value="0">Không</option>
          <option value="1">Có</option>
        </select>
      </div>
      <div className="mb-3">
        <button className="edit-btn-products" type="submit">Sửa sản phẩm</button> &nbsp;
        <Link to="/product" className="btn-products-list">Danh sách sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductEdit;