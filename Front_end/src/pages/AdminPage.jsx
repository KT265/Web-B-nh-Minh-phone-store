
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
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
      console.error("Lỗi tải user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterRole === 'admin') {
      matchesFilter = user.isAdmin === true;
    } else if (filterRole === 'user') {
      matchesFilter = user.isAdmin === false;
    }

    return matchesSearch && matchesFilter;
  });

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này vĩnh viễn?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/customer/${id}`, config);
        
        alert("Đã xóa người dùng!");
        fetchUsers();
      } catch (error) {
        alert("Lỗi xóa: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
    setShowModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(
        `http://localhost:5000/api/customer/${selectedUser._id}`,
        { name, email, isAdmin },
        config
      );

      alert("Cập nhật thành công!");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

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

            <div className="table-container">
              <div className="table-filters">
                <input 
                  type="text" 
                  placeholder="Tìm theo tên hoặc email..." 
                  className="filter-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                
                <div className="filter-actions">
                  <select 
                    className="filter-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
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
                            <div style={{display: 'flex', gap: '10px'}}>
                              <button 
                                className="action-btn" 
                                title="Edit"
                                onClick={() => handleEditClick(user)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                              </button>
                              
                              <button 
                                className="action-btn delete" 
                                title="Delete"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                              
                              <button className="action-btn" title="More">⋮</button>
                            </div>
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
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{width: '400px'}}>
            <div className="modal-header">
              <h3>Phân Quyền Người Dùng</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleUpdateUser}>
               <div className="form-group">
                  <label>Tên người dùng</label>
                  <input 
                    type="text" 
                    value={name} 
                    readOnly
                    disabled 
                    className="form-control"
                    style={{
                        width: '100%', 
                        padding: '8px', 
                        marginBottom: '10px', 
                        backgroundColor: '#e9ecef',
                        color: '#6c757d',
                        cursor: 'not-allowed'
                    }}
                  />
               </div>
               
               <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    readOnly
                    disabled
                    className="form-control"
                    style={{
                        width: '100%', 
                        padding: '8px',
                        backgroundColor: '#e9ecef',
                        color: '#6c757d',
                        cursor: 'not-allowed'
                    }}
                  />
               </div>

               <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px'}}>
                  <input 
                    type="checkbox" 
                    id="isAdminCheck"
                    checked={isAdmin} 
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    style={{width: '20px', height: '20px'}}
                  />
                  <label htmlFor="isAdminCheck" style={{marginBottom: 0, cursor: 'pointer'}}>
                     Đặt làm Quản Trị Viên (Admin)
                  </label>
               </div>

               <div className="modal-actions" style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setShowModal(false)}
                    style={{padding: '8px 16px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer'}}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    style={{padding: '8px 16px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                  >
                    Lưu Thay Đổi
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;