import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import './AdminPage.css'; // Import CSS

const AdminPage = () => {
  const [users] = useState([

  ]);

  return (
    <div className="admin-container">
      <Navbar/>
      <div className="admin-con">
        <aside className="admin-sidebartotal">
          <div className="admin-sidebar">
            <div className="sidebar-logo">
              <div className="logo-icon">A</div>
              <span>Quản Lý</span>
            </div>

            <ul className="sidebar-menu">
              <li>
                <Link to="/admin" className="menu-item active">
                  <span></span> Người Dùng
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="menu-item">
                  <span></span> Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="menu-item">
                  <span></span> Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/admin/settings" className="menu-item">
                  <span></span> Cài Đặt
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <div className="admin-content">
          
          <header className="admin-navbar">
            <div className="search-box">
              <span style={{position: 'absolute', left: '15px', top: '10px'}}></span>
              <input type="text" placeholder="Tìm Kiếm..." />
            </div>
            
            <div className="nav-right">
              <span style={{fontSize: '20px', cursor: 'pointer'}}>🔔</span>
              <div className="admin-profile">
                <div className="admin-info" style={{textAlign: 'right'}}>
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
                <div className="value">4</div>
              </div>
              <div className="stat-card">
                <h3>Đang Hoạt Động</h3>
                <div className="value">1</div>
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
                <input type="text" placeholder="Search users by name or email..." className="filter-input" />
                <div className="filter-actions">
                  <button>Tất cả trạng thái ▼</button>
                  {/* <button>More Filters</button> */}
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
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {user.status === 'Active' ? '✔ Active' : '🚫 Inactive'}
                        </span>
                      </td>
                      <td>{user.orders}</td>
                      <td>{user.spent}</td>
                      <td>{user.joined}</td>
                      <td>
                        <button className="action-btn" title="Edit">✏️</button>
                        <button className="action-btn delete" title="Delete">🗑️</button>
                        <button className="action-btn" title="More">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>  
      </div>
      <div className="footer">
        <Footer/>
      </div>
    </div>
  );
};

export default AdminPage;