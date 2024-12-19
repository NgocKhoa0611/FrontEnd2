import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const productsPerPage = 5;

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/product`);
      if (!response.ok) throw new Error("Lỗi khi lấy danh mục");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_id.toString().includes(searchKeyword) ||
    product.product_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.product_id - b.product_id;
    } else {
      return b.product_id - a.product_id;
    }
  })

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

  const hideProduct = async (product_id, is_hidden) => {
    const newStatus = is_hidden ? "show" : "hide";
    if (window.confirm(`Bạn có chắc chắn muốn ${newStatus} sản phẩm này?`)) {
      try {
        const response = await axios.patch(`${API_URL}/product/${newStatus}/${product_id}`, {}, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          console.log(`Sản phẩm đã được ${newStatus} thành công`);
          fetchProduct();
        } else {
          console.error("Lỗi khi thay đổi trạng thái sản phẩm");
        }
      } catch (error) {
        console.error("Error changing product status:", error);
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="products-table">
      <h2 className="text-3xl pb-4">Danh sách sản phẩm</h2>
      <div className="search-flex-products">
        <Link to={`add-product`} className="add-btn-products">Thêm sản phẩm</Link>
        <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
          <input className="form-control-search-products" type="search" placeholder="Tìm kiếm theo ID hoặc Tên sản phẩm..." aria-label="Search" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          <button className="search-btn-products" type="submit">Tìm kiếm</button>
        </form>
      </div>
      <table id="example" className="table-products">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>
              <span>ID</span>
              <button className="sort-btn" onClick={handleSortById}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </th>
            <th style={{ width: '25%' }}>Tên sản phẩm</th>
            <th style={{ width: '15%' }}>Giá</th>
            <th style={{ width: '15%' }}>Giá khuyến mãi</th>
            <th style={{ width: '25%' }}>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              <td>{product.price}</td>
              <td>{product.price_promotion}</td>
              <td>
                <Link to={`/admin/productdetaillist/${product.product_id}`} className="detail-btn">Chi tiết</Link>
                <Link to={`/admin/productlist/edit-product/${product.product_id}`} className="edit-btn-prod"> Sửa</Link>
                <button className={`hide-btn-products ${product.is_hidden ? 'show-text' : ''}`} onClick={() => hideProduct(product.product_id, product.is_hidden)}>
                  {product.is_hidden ? "Hiện" : "Ẩn"}
                </button>
              </td>
            </tr>
          ))}
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

export default ProductList;