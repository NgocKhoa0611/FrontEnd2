import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

function CategoriesEdit() {
    let { id } = useParams();
    const [categories, setCategories] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/category/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu danh mục:", error);
            });
    }, [id]);

    const submitDuLieu = () => {
        axios.put(`${API_URL}/category/update/${id}`, categories, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                alert("Đã cập nhật danh mục");
                navigate('/admin/categorieslist');
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật danh mục:", error);
            });
    };

    return (
        <form className="frmeditcate" id="frmeditcate">
            <h2 class="text-3xl pb-4">Sửa danh mục</h2>
            <div className='col'>
                ID danh mục:
                <input
                    defaultValue={categories.category_id}
                    type="id"
                    className="form-control"
                    onChange={e => setCategories({ ...categories, category_id: e.target.value })}
                />
            </div>
            <div className='col'>
                ID danh mục cha:
                <input
                    defaultValue={categories.category_parent_id}
                    type="id"
                    className="form-control"
                    onChange={e => setCategories({ ...categories, category_parent_id: e.target.value })}
                />
            </div>
            <div className='col'>
                Tên danh mục:
                <input
                    defaultValue={categories.category_name}
                    type="text"
                    className="form-control"
                    onChange={e => setCategories({ ...categories, category_name: e.target.value })}
                />
            </div>
            <div className="mb-3">
                <button className="edit-btn-categories" type="button" onClick={submitDuLieu}>Sửa danh mục</button> &nbsp;
                <Link to={`/categories`} className="btn-categories-list">Danh sách danh mục</Link>
            </div>
        </form>
    )
}

export default CategoriesEdit;
