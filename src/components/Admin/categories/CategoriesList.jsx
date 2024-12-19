import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Categories.css';
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const categoriesPerPage = 5;

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/category`);
            if (!response.ok) throw new Error("Lỗi khi lấy danh mục");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const hideCategory = async (category_id, is_hidden) => {
        const newStatus = is_hidden ? "show" : "hide";
        if (window.confirm(`Bạn có chắc chắn muốn ${newStatus} danh mục này?`)) {
            try {
                const response = await axios.patch(`${API_URL}/category/${newStatus}/${category_id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    console.log(`Danh mục đã được ${newStatus} thành công`);
                    fetchCategories();
                } else {
                    console.error("Lỗi khi thay đổi trạng thái danh mục");
                }
            } catch (error) {
                console.error("Error changing category status:", error);
            }
        }
    };

    const filteredCategories = categories.filter(category =>
        category.category_id.toString().includes(searchKeyword) ||
        category.category_name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const sortedProducts = [...filteredCategories].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.category_id - b.category_id;
        } else {
            return b.category_id - a.category_id;
        }
    })

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = sortedProducts.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(sortedProducts.length / categoriesPerPage);

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

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="categories-table">
            <h2 class="text-3xl pb-4">Danh sách danh mục</h2>
            <div className="search-flex-cate">
                <Link to={`add-categories`} href="/#" className="add-btn-categories">Thêm danh mục</Link>
                <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                    <input className="form-control-search-categories" type="search" placeholder="Tìm kiếm theo ID hoặc Tên danh mục..." aria-label="Search" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                    <button className="search-btn-catgories" type="button">Tìm kiếm</button>
                </form>
            </div>
            <table id="example" className="table-cate">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>
                            <span>ID</span>
                            <button className="sort-btn" onClick={handleSortById}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </th>
                        <th>ID danh mục chính</th>
                        <th>Tên danh mục</th>
                        <th>Công cụ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.map((categories) => (
                        <tr key={categories.category_id}>
                            <td>{categories.category_id}</td>
                            <td>{categories.category_parent_id}</td>
                            <td>{categories.category_name}</td>
                            <td>
                                <Link to={`/admin/categorieslist/edit-categories/${categories.category_id}`} className="edit-btn-cate">Sửa</Link>
                                <button className={`hide-btn-categories ${categories.is_hidden ? 'show-text' : ''}`} onClick={() => hideCategory(categories.category_id, categories.is_hidden)}>
                                    {categories.is_hidden ? "Hiện" : "Ẩn"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">Trang trước </button>
                <span className="pagination-info">Trang {currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">Trang sau</button>
            </div>
        </div>
    );
}

export default CategoriesList;