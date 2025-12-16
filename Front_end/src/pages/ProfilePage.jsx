import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState('profile'); 
  
  // State dữ liệu
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]); // Lưu danh sách đơn hàng thật
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      const userData = userInfo.user || userInfo;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dob: '01/01/2000'
      });

      // Lấy danh sách đơn hàng ngay khi vào trang
      fetchMyOrders(userInfo.token);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Hàm gọi API lấy đơn hàng
  const fetchMyOrders = async (token) => {
    try {
      setLoadingOrders(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);
  
  // Hàm Lưu (Gọi API)
  const handleSaveClick = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Gọi API cập nhật (PUT)
      const { data } = await axios.put(
        'http://localhost:5000/api/customer/profile',
        {
          name: formData.name,
          phone: formData.phone,

        },
        config
      );

      // Cập nhật thành công
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      setUser(data); 
      setIsEditing(false); 
      alert("Cập nhật thành công!");

    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin");
    }
  };

  if (!user) return null;

  // Render nội dung bên phải dựa trên activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-details">
            <div className="details-header">
              <h3>Thông Tin Cá Nhân</h3>
              {!isEditing && (
                <button className="edit-btn" onClick={handleEditClick}>✎ Chỉnh Sửa</button>
              )}
            </div>
            <div className="form-grid">
               <div className="form-group full-width">
                  <label>Họ và Tên</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} readOnly={!isEditing} className={isEditing ? 'input-editable' : ''} />
               </div>
               <div className="form-group full-width">
                  <label>Email</label>
                  <input type="email" value={formData.email} readOnly style={{backgroundColor: '#e9ecef'}} />
               </div>
               <div className="form-group full-width">
                  <label>Số điện thoại</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} readOnly={!isEditing} className={isEditing ? 'input-editable' : ''} />
               </div>
            </div>
            {isEditing && (
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <button onClick={handleSaveClick} style={{padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Lưu Thay Đổi</button>
                <button onClick={handleCancelClick} style={{padding: '10px 20px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer'}}>Hủy</button>
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="orders-section">
            <h3 style={{marginBottom: '20px'}}>Lịch Sử Đơn Hàng</h3>
            <div className="orders-container">
              {loadingOrders ? (
                <p>Đang tải đơn hàng...</p>
              ) : orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-id-wrapper">
                        <div className="order-icon-box">📦</div>
                        <div className="order-id-text">
                          <h4>Mã đơn: #{order._id.substring(0, 8).toUpperCase()}</h4>
                          <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <span className={`status-badge ${order.isDelivered ? 'status-delivered' : 'status-pending'}`}>
                        {order.isDelivered ? 'Giao thành công' : 'Đang xử lý'}
                      </span>
                    </div>
                    <div className="order-footer">
                      <div className="order-stats">
                        <div className="stat-item">
                          <span className="stat-label">Tổng tiền</span>
                          <span className="stat-value">{order.totalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Sản phẩm</span>
                          <span className="stat-value">{order.orderItems.length} món</span>
                        </div>
                      </div>
                      <button className="view-details-btn">Xem Chi Tiết</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="profile-details">
            <div className="details-header">
              <h3>Sổ Địa Chỉ</h3>
              <button className="edit-btn">+ Thêm địa chỉ mới</button>
            </div>
            <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
              <p>Bạn chưa lưu địa chỉ nào.</p>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="profile-details">
            <div className="details-header">
              <h3>Phương Thức Thanh Toán</h3>
              <button className="edit-btn">+ Thêm thẻ mới</button>
            </div>
            <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
              <p>Chưa có phương thức thanh toán được lưu.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="profile-details">
            <div className="details-header">
              <h3>Cài Đặt Tài Khoản</h3>
            </div>
            <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                    <input type="checkbox" defaultChecked /> Nhận thông báo qua email
                </label>
            </div>
            <div className="form-group" style={{marginTop: '15px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                    <input type="checkbox" /> Xác thực 2 bước (2FA)
                </label>
            </div>
            <div style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                {/* <h4 style={{color: '#ff4d4f', marginBottom: '10px'}}>Khu vực nguy hiểm</h4> */}
                <button style={{padding: '10px 20px', backgroundColor: '#fff1f0', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '5px', cursor: 'pointer'}}>
                    Xóa tài khoản
                </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const fullName = formData.name || "User";
  const avatarInitials = fullName.charAt(0).toUpperCase();

  return (
    <div className="profile-page-container">
      <div className="profile-header-card">
        <div className="user-info-summary">
          <div className="avatar-circle">{avatarInitials}</div>
          <div className="user-text">
            <h2>{formData.name}</h2>
            <p>{formData.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-content-wrapper">

        <aside className="profile-sidebar">
          <ul className="sidebar-menu">
            <li 
                className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
            >
              <span></span> Thông Tin Cá Nhân
            </li>
            
            <li 
                className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
            >
              <span></span> Đơn Hàng Của Bạn
            </li>

            <li 
                className={`sidebar-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
            >
              <span></span> Địa Chỉ
            </li>

            <li 
                className={`sidebar-item ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
            >
              <span></span> Phương Thức Thanh Toán
            </li>
            
            <li 
                className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
            >
              <span></span> Cài Đặt
            </li>
          </ul>
        </aside>

        {/* RENDER CONTENT */}
        <div style={{flex: 1}}>
            {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;