import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function ProductDetailList() {
  const [detail, setDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const productsPerPage = 10; // Số sản phẩm trên mỗi trang
  const { id } = useParams();

  const fetchProductDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/${id}`);
      const productDetailArray = response.data.detail || []; // Ensure detail is always an array
      setDetail(productDetailArray);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      setDetail([]); // Set detail to an empty array in case of an error
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const sortedProducts = [...detail].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.product_detail_id - b.product_detail_id;
    } else {
      return b.product_detail_id - a.product_detail_id;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleSortById = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="products-table">
      <h3 className="title-page">Danh sách chi tiết sản phẩm</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
      <Link to={`/admin/productdetaillist/add-detail/${id}`} id="mb-2" className="add-btn-products">Thêm chi tiết</Link>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              <span>ID Chi tiết</span>
              <button className="sort-btn" onClick={handleSortById}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </th>
            <th>Tên màu</th>
            <th>Tên kích cỡ</th>
            <th>Số lượng</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>isFeatured</th>
            <th>isHot</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map(detailItem => (
              <tr key={detailItem.product_detail_id}>
                <td>{detailItem.product_detail_id}</td>
                <td>{detailItem.color ? detailItem.color.color_name : "Không có màu"}</td>
                <td>{detailItem.size ? detailItem.size.size_name : "Không có kích thước"}</td>
                <td>{detailItem.quantity || 0}</td>
                <td>{detailItem.description || "Không có mô tả"}</td>
                <td>
                  {detailItem.productImage ? (
                    <img src={`${API_URL}/img/${detailItem.productImage.img_url}`} alt="Sản phẩm" style={{ width: '80px', height: '80px' }} />
                  ) : (
                    "Không có hình ảnh"
                  )}
                </td>
                <td>{detailItem.isFeatured ? "Có" : "Không"}</td>
                <td>{detailItem.isHot ? "Có" : "Không"}</td>
                <td>
                  <Link to={`/admin/productdetaillist/edit-detail/${detailItem.product_detail_id}`} className="edit-btn">Sửa</Link>
                  <button className={`hide-btn-products ${detailItem.is_hidden ? 'show-text' : ''}`}>
                    {detailItem.is_hidden ? "Hiện" : "Ẩn"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có chi tiết sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Trang trước</button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Trang sau</button>
      </div>
    </div>
  );
}

export default ProductDetailList;
