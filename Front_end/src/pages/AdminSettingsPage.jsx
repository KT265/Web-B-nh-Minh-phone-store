import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

import '../styles/AdminSettingsPage.css';
import '../styles/AdminPage.css';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newDate, setNewDate] = useState('');

  const [storeName, setStoreName] = useState('Bình Minh Phone Store');
  const [storePhone, setStorePhone] = useState('0333132230');
  const [storeAddress, setStoreAddress] = useState('3/27/350 Kim Giang, Hoàng Mai, HN');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;
      
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'coupons') {
      fetchCoupons();
    }
  }, [activeTab]);

  const fetchCoupons = async () => {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/coupons', config);
        setCoupons(data);
    } catch (error) {
        console.error("Lỗi lấy mã giảm giá:", error);
    }
  }

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        await axios.post('http://localhost:5000/api/coupons', {
            code: newCode,
            discount: newDiscount,
            expirationDate: newDate
        }, config);

        alert('Thêm mã thành công!');
        setNewCode('');
        setNewDiscount('');
        setNewDate('');
        fetchCoupons();
    } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi thêm mã');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if(!window.confirm('Bạn chắc chắn muốn xóa mã này?')) return;
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/coupons/${id}`, config);
        fetchCoupons();
    } catch (error) {
        alert('Lỗi khi xóa mã');
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.put('http://localhost:5000/api/customer/profile', { name, email, password }, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert("Cập nhật thông tin thành công!");
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-con">
        <aside className="admin-sidebartotal">
          <div className="admin-sidebar">
            <div className="sidebar-logo"><div className="logo-icon">A</div><span>Quản Lý</span></div>
            <ul className="sidebar-menu">
              <li><Link to="/admin" className="menu-item"><span></span> Người Dùng</Link></li>
              <li><Link to="/admin/products" className="menu-item"><span></span> Sản Phẩm</Link></li>
              <li><Link to="/admin/orders" className="menu-item"><span></span> Đơn Hàng</Link></li>
              <li><Link to="/admin/settings" className="menu-item active"><span></span> Cài Đặt</Link></li>
            </ul>
          </div>
        </aside>

        <div className="admin-content">
          <header className="admin-navbar">
            <div className="search-box"></div>
            <div className="nav-right">
              <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
              <div className="admin-profile">
                <div className="admin-info" style={{ textAlign: 'right' }}>
                  <h4>{name}</h4><p>Admin</p>
                </div>
                <div className="admin-avatar">AD</div>
              </div>
            </div>
          </header>

          <div className="page-content-wrapper">
            <div className="page-header">
              <h2>Cài Đặt Hệ Thống</h2>
              <p>Cấu hình thông tin cửa hàng và tài khoản quản trị</p>
            </div>

            <div className="settings-container">
              <div className="settings-menu">
                <div className={`settings-menu-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                  Thông tin Cửa Hàng <span>›</span>
                </div>
                <div className={`settings-menu-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
                  Tài Khoản Admin <span>›</span>
                </div>
                <div className={`settings-menu-item ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>
                  Thanh Toán & Ship <span>›</span>
                </div>
                <div className={`settings-menu-item ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>
                  Mã Giảm Giá<span>›</span>
                </div>
              </div>

              <div className="settings-panel">
                {activeTab === 'general' && (
                  <div>
                    <div className="settings-header"><h3>Thông Tin Cửa Hàng</h3></div>
                    <form>
                      <div className="form-group"><label>Tên Cửa Hàng</label><input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}/></div>
                      <div className="form-row">
                        <div className="form-col"><div className="form-group"><label>Hotline</label><input type="text" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} /></div></div>
                        <div className="form-col"><div className="form-group"><label>Email</label><input type="email" value="BinhMinhstore@gmail.com" readOnly style={{backgroundColor: '#f9f9f9'}}/></div></div>
                      </div>
                      <div className="form-group"><label>Địa chỉ</label><input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} /></div>
                      <button type="button" className="btn-save" onClick={() => alert('Đã lưu cấu hình (Minh họa)')}>Lưu Thay Đổi</button>
                    </form>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div>
                    <div className="settings-header"><h3>Admin Profile Settings</h3></div>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="form-group"><label>Tên hiển thị</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
                      <div className="form-group"><label>Email đăng nhập</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                      <div className="settings-header" style={{marginTop: '30px', paddingTop: '20px'}}><h3>Đổi Mật Khẩu</h3></div>
                      <div className="form-row">
                        <div className="form-col"><div className="form-group"><label>Mật khẩu mới</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div>
                        <div className="form-col"><div className="form-group"><label>Xác nhận mật khẩu</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div></div>
                      </div>
                      <button type="submit" className="btn-save">Cập Nhật Tài Khoản</button>
                    </form>
                  </div>
                )}

                {activeTab === 'coupons' && (
                  <div>
                    <div className="settings-header"><h3>Quản Lý Mã Giảm Giá</h3></div>
                    
                    <form onSubmit={handleAddCoupon} style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                        <h4 style={{marginTop: 0, marginBottom: '15px', fontSize: '15px'}}>+ Tạo mã mới</h4>
                        <div className="form-row">
                            <div className="form-col">
                                <div className="form-group">
                                    <label>Mã Code (VD: SALE50)</label>
                                    <input type="text" required value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="SALE2025" />
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label>Giảm giá (%)</label>
                                    <input type="number" required min="1" max="100" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} placeholder="10" />
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label>Ngày hết hạn</label>
                                    <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn-save" style={{marginTop: 0}}>Tạo Mã</button>
                    </form>

                    {/* Danh sách mã */}
                    <div style={{marginTop: '20px'}}>
                        <h4 style={{marginBottom: '15px'}}>Danh sách mã hiện có</h4>
                        {coupons.length === 0 ? <p style={{color:'#777'}}>Chưa có mã giảm giá nào.</p> : (
                            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                <thead>
                                    <tr style={{background: '#eee', textAlign: 'left'}}>
                                        <th style={{padding: '10px', borderRadius: '4px 0 0 4px'}}>Mã</th>
                                        <th style={{padding: '10px'}}>Giảm</th>
                                        <th style={{padding: '10px'}}>Hết hạn</th>
                                        <th style={{padding: '10px', borderRadius: '0 4px 4px 0'}}>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map(coupon => (
                                        <tr key={coupon._id} style={{borderBottom: '1px solid #eee'}}>
                                            <td style={{padding: '10px', fontWeight: 'bold', color: '#0d6efd'}}>{coupon.code}</td>
                                            <td style={{padding: '10px'}}>{coupon.discount}%</td>
                                            <td style={{padding: '10px'}}>{new Date(coupon.expirationDate).toLocaleDateString('vi-VN')}</td>
                                            <td style={{padding: '10px'}}>
                                                <button 
                                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                                    style={{background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'payment' && (
                  <div><div className="settings-header"><h3>Thanh Toán & Vận Chuyển</h3></div><p style={{color: '#888'}}>Tính năng đang phát triển...</p></div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer"><Footer /></div>
    </div>
  );
};

export default AdminSettingsPage;