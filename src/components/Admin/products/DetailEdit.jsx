import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function ProductEdit() {
  let { id } = useParams();
  const [product, setProduct] = useState({
    product_id: '',
    product_name: '',
    category_id: '',
    price: '',
    price_promotion: '',
    img_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    let opt = {
      method: "get",
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`${API_URL}/product/${id}`, opt)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        alert("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.");
      });
  }, [id]);

  const submitDuLieu = (e) => {
    e.preventDefault();
    let url = `${API_URL}/product/${id}`;
    let opt = {
      method: "put",
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(url, opt)
      .then(res => res.json())
      .then(data => {
        alert("Đã cập nhật sản phẩm");
        navigate('/product');
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại!");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'price' || name === 'price_promotion' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  return (
    <form id="frmeditproduct" className="frmeditproduct" onSubmit={submitDuLieu}>
      <h2>Sửa sản phẩm</h2>
      <div className='col'>ID sản phẩm:
        <input value={product.product_id} type="text" className="form-control" readOnly />
      </div>
      <div className='col'>Tên sản phẩm:
        <input value={product.product_name} type="text" className="form-control" name="product_name" onChange={handleChange} />
      </div>
      <div className='col'>Danh mục:
        <input value={product.category_id} type="text" className="form-control" name="category_id" onChange={handleChange} />
      </div>
      <div className='col'>Giá:
        <input value={product.price} type="number" className="form-control" name="price" onChange={handleChange} />
      </div>
      <div className='col'>Giá khuyến mãi:
        <input value={product.price_promotion} type="number" className="form-control" name="price_promotion" onChange={handleChange} />
      </div>
      {/* <div className='col'>Hình ảnh:
        <input value={product.img_url} type="text" className="form-control" name="img_url" onChange={handleChange} />
      </div> */}
      <div className="mb-3">
        <button className="edit-btn-products" type="submit">Sửa sản phẩm</button> &nbsp;
        <Link to={`/product`} className="btn-products-list">Danh sách sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductEdit;
