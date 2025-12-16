import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]); // Danh sách gốc từ API
  const [loading, setLoading] = useState(true);
  
  // 1. Thêm State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'admin', 'user'

  // Gọi API lấy dữ liệu (Giữ nguyên như cũ)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;

        if (!userInfo || !userInfo.token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('http://localhost:5000/api/customer', config);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. Logic Lọc & Tìm kiếm (Xử lý Client-side)
  const filteredUsers = users.filter((user) => {
    // a. Logic tìm kiếm (theo tên hoặc email, không phân biệt hoa thường)
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // b. Logic lọc theo quyền (Admin/User)
    let matchesFilter = true;
    if (filterRole === 'admin') {
      matchesFilter = user.isAdmin === true;
    } else if (filterRole === 'user') {
      matchesFilter = user.isAdmin === false; // Hoặc !user.isAdmin
    }

    return matchesSearch && matchesFilter;
  });

  // Các biến thống kê (tính trên danh sách gốc hoặc danh sách lọc tùy bạn, ở đây mình tính trên gốc)
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isAdmin).length; 

  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-con">
        <aside className="admin-sidebartotal">
          <div className="admin-sidebar">
            <div className="sidebar-logo">
              <div className="logo-icon">A</div>
              <span>Quản Lý</span>
            </div>
            <ul className="sidebar-menu">
              <li><Link to="/admin" className="menu-item active"><span></span> Người Dùng</Link></li>
              <li><Link to="/admin/products" className="menu-item"><span></span> Sản Phẩm</Link></li>
              <li><Link to="/admin/orders" className="menu-item"><span></span> Đơn Hàng</Link></li>
              <li><Link to="/admin/settings" className="menu-item"><span></span> Cài Đặt</Link></li>
            </ul>
          </div>
        </aside>

        <div className="admin-content">
          <header className="admin-navbar">
            <div className="search-box">
              <input type="text" placeholder="Tìm Kiếm chung..." />
            </div>
            <div className="nav-right">
              <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
              <div className="admin-profile">
                <div className="admin-info" style={{ textAlign: 'right' }}>
                  <h4>Admin</h4>
                  <p>adminbinhminh@gmail.com</p>
                </div>
                <div className="admin-avatar">AD</div>
              </div>
            </div>
          </header>

          <div className="page-content-wrapper">
            <div className="page-header">
              <h2>Quản Lý Người Dùng</h2>
              <p>Quản lý và theo dõi người dùng</p>
            </div>

            {/* STATS CARDS */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tổng Số Người Dùng</h3>
                <div className="value">{totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Đang Hoạt Động</h3>
                <div className="value">{activeUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Tham Gia Tháng Này</h3>
                <div className="value">0</div>
              </div>
              <div className="stat-card">
                <h3>Bị Cấm</h3>
                <div className="value">0</div>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div className="table-container">
              <div className="table-filters">
                {/* INPUT TÌM KIẾM */}
                <input 
                  type="text" 
                  placeholder="Tìm theo tên hoặc email..." 
                  className="filter-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                
                <div className="filter-actions">
                  {/* SELECT LỌC TRẠNG THÁI */}
                  <select 
                    className="filter-select" // Class mới để style
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="user">Người dùng (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>

              <table className="user-table">
                <thead>
                  <tr>
                    <th>Người Dùng</th>
                    <th>Trạng Thái</th>
                    <th>Đơn Hàng</th>
                    <th>Tổng Chi</th>
                    <th>Tham Gia vào</th>
                    <th>Chỉnh Sửa</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy kết quả nào.</td></tr>
                  ) : (
                    // DUYỆT QUA filteredUsers THAY VÌ users
                    filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${!user.isAdmin ? 'status-active' : 'status-inactive'}`}>
                            {!user.isAdmin ? '✔ User' : '🛡 Admin'}
                          </span>
                        </td>
                        <td>0</td> 
                        <td>0 đ</td>
                        <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <button className="action-btn" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                          </button>
                          <button className="action-btn delete" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                          <button className="action-btn" title="More">⋮</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;