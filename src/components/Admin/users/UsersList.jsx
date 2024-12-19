import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import './Users.css';
import { API_URL } from "../../../../configs/varibles";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(""); // Trạng thái lưu từ khóa tìm kiếm
  const [sortOrder, setSortOrder] = useState('asc');
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`);
      setUsers(response.data);
    } catch (error) {
      console.error("Có lỗi khi lấy danh sách người dùng!", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`${API_URL}/user/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Có lỗi khi xóa người dùng!", error);
        alert(`Có lỗi khi xóa người dùng: ${error.message}`);
      }
    }
  };

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(user => {
    const userId = user?.user_id?.toString().toLowerCase() || ""; // Kiểm tra user_id an toàn
    const userName = user?.name?.toLowerCase() || ""; // Kiểm tra name an toàn
    return userId.includes(searchKeyword.toLowerCase()) || userName.includes(searchKeyword.toLowerCase());
  });


  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.user_id - b.user_id;
    } else {
      return b.user_id - a.user_id;
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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
    fetchUsers();
  }, []);

  return (
    <div className="users-table">
      <h2 class="text-3xl pb-4">Danh sách người dùng</h2>
      <div className="search-flex-users">
        <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control-search-users"
            type="search"
            placeholder="Tìm kiếm theo ID hoặc Tên người dùng..."
            aria-label="Search"
            value={searchKeyword} // Gắn giá trị của từ khóa tìm kiếm
            onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật trạng thái từ khóa tìm kiếm
          />
          <button className="search-btn-users" type="button">Tìm kiếm</button>
        </form>
      </div>
      <table id="example" className="table-users">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>
              <span>ID</span>
              <button className="sort-btn" onClick={handleSortById}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </th>
            <th>Tên người dùng</th>
            <th>Ảnh tài khoản</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>SĐT</th>
            <th>Ngày đăng ký</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td className="flex justify-center items-center">
                <img src={`${API_URL}/avatar/${user.avatar || "default-avatar.jpg"}`} alt="Avatar" width="60" />
              </td>
              <td>{user.email}</td>
              <td>{user.role === 0 ? 'User' : 'Admin'}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.registration_date).toLocaleString()}</td>
              <td>
                <button className="delete-btn-users" disabled onClick={() => handleDeleteUser(user.user_id)}>Xóa</button>
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
};

export default UserTable;