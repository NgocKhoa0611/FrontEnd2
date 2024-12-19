import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Categories.css';
import { API_URL } from "../../../../configs/varibles";

function NewCategories() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            category_parent_id: '',
            category_name: ''
        },
        validationSchema: Yup.object({
            category_parent_id: Yup.string().required('ID danh mục cha là bắt buộc'),
            category_name: Yup.string().required('Tên danh mục là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await fetch(`${API_URL}/category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                });

                const result = await res.json();
                if (result.error) {
                    alert(result.error);
                    return;
                }

                alert('Thêm danh mục thành công!');
                navigate('/admin/categorieslist');
            } catch (err) {
                console.error('Error:', err);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        }
    });

    return (
        <form className="frmaddcate" id="frmaddcate" onSubmit={formik.handleSubmit}>
            <h2 class="text-3xl pb-4">Thêm danh mục</h2>
            <div className='col'>
                <label>ID danh mục chính:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category_parent_id"
                    value={formik.values.category_parent_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category_parent_id && formik.errors.category_parent_id && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.category_parent_id}</div>
                )}
            </div>
            <div className='col'>
                <label>Tên danh mục:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category_name"
                    value={formik.values.category_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category_name && formik.errors.category_name && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.category_name}</div>
                )}
            </div>

            <div className="mb-3">
                <button className="add-btn-categories" type="submit">
                    Thêm danh mục
                </button> &nbsp;
                <Link to={`/categories`} href="/#" className="btn-categories-list">Danh sách</Link>
            </div>
            {/* Note Section */}
            <div className="bg-white text-gray-700 p-3 rounded-md">
                <h3 className="font-semibold">Ghi chú:</h3>
                <p className="text-sm">
                    <span className="font-medium">ID danh mục chính: Áo: 1, Quần: 2, Phụ kiện: 3, Giày: 4</span>
                </p>
                <ul className="list-disc text-sm">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </form>
    );
}

export default NewCategories;
