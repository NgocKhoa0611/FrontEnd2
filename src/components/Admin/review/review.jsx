import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../configs/varibles";

function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingComment, setEditingComment] = useState(null); // State để giữ bình luận đang chỉnh sửa
  const [newContent, setNewContent] = useState(""); // State để lưu nội dung mới khi chỉnh sửa
  const commentsPerPage = 5;

  // Fetch comments từ API
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/review`, {
        params: { product_detail_id: "your_product_detail_id_here" },
      });

      if (response.status === 200) {
        setComments(response.data);
      } else {
        console.error("Lỗi khi lấy bình luận");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Xóa bình luận
  const deleteComment = async (comment_id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        const response = await axios.delete(`${API_URL}/review/deletereview/${comment_id}`);
        if (response.status === 200) {
          alert("Bình luận đã được xóa thành công");
          fetchComments(); // Reload lại danh sách bình luận sau khi xóa
        } else {
          console.error("Lỗi khi xóa bình luận");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  // Cập nhật bình luận
  const handleEditComment = async () => {
    if (!newContent) {
      alert("Nội dung bình luận không thể trống!");
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/review/updatereview/${editingComment.review_id}`, {
        content: newContent,
      });
      if (response.status === 200) {
        alert("Cập nhật bình luận thành công!");
        fetchComments();
        setEditingComment(null);
        setNewContent("");
      } else {
        console.error("Lỗi khi cập nhật bình luận");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Lọc bình luận theo từ khóa
  const filteredComments = comments.filter(
    (comment) =>
      comment.review_id.toString().includes(searchKeyword) ||
      comment.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Sắp xếp bình luận theo ID
  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.review_id - b.review_id;
    } else {
      return b.review_id - a.review_id;
    }
  });

  // Phân trang
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

  // Chuyển sang trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Quay lại trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Sắp xếp theo ID
  const handleSortById = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    fetchComments();
  }, []); // Fetch comments when the component mounts

  return (
    <div className="p-8">
      <table className="w-[86%] ml-[14%] table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-[#0F3460]">
            <th className="px-4 py-2 text-center text-white">Tên người dùng</th>
            <th className="px-4 py-2 text-center text-white">Nội dung bình luận</th>
            <th className="px-4 py-2 text-center text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.map((comment) => (
            <tr key={comment.review_id} className="border-b">
              <td className="px-4 py-2">{comment.user.name}</td>
              <td className="px-4 py-2">{comment.content}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    setEditingComment(comment);
                    setNewContent(comment.content);
                  }}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteComment(comment.review_id)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa bình luận */}
      {editingComment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center transition-all duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full transform transition-all duration-500 ease-in-out scale-95 hover:scale-100">
            {/* Tiêu đề modal */}
            <h2 className="text-3xl font-bold text-[#0F3460] mb-6 text-center">Chỉnh sửa bình luận</h2>

            {/* Hiển thị thông tin người dùng và ngày bình luận */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium text-gray-800 mb-2">
                <strong>Tên người dùng:</strong> {editingComment.user.name}
              </p>
              <p className="font-medium text-gray-800">
                <strong>Ngày bình luận:</strong> {new Date(editingComment.date).toLocaleDateString()}
              </p>
            </div>

            {/* Nội dung bình luận */}
            <div className="mb-6">
              <label htmlFor="commentContent" className="block text-lg font-medium text-gray-800 mb-2">Nội dung bình luận</label>
              <textarea
                id="commentContent"
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3460] resize-none"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Nhập nội dung bình luận mới..."
              />
            </div>

            {/* Các nút hành động */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingComment(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleEditComment}
                className="px-6 py-2 bg-[#0F3460] text-white rounded-lg hover:bg-[#0F3460]/90 transition-all"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}



      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-6 py-2 ml-52 bg-[#0F3460] text-white rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="text-lg">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-[#0F3460] text-white rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default CommentManagement;
