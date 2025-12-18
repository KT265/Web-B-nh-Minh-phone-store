import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/AdminOrderPage.css';
import '../styles/AdminPage.css';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const fetchOrders = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null;

      if (!userInfo || !userInfo.token) {
        alert("Vui lòng đăng nhập quyền Admin!");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    let currentStatus = 'Processing';
    if (order.isDelivered) currentStatus = 'Delivered';
    else if (order.isCancelled) currentStatus = 'Cancelled';
    setStatusToUpdate(currentStatus);
    setShowModal(true);
  };
  const handleDeleteOrder = async () => {
    if(!window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN đơn hàng này khỏi Database? Hành động này không thể hoàn tác!')) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.delete(
        `http://localhost:5000/api/orders/${selectedOrder._id}`,
        config
      );

      alert("Đã xóa bay màu đơn hàng!");
      setShowModal(false); 
      fetchOrders();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };
  const handleUpdateStatus = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/status`,
        { status: statusToUpdate },
        config
      );

      alert(`Đã cập nhật trạng thái thành: ${statusToUpdate}`);
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredOrders = orders.filter(order => {
    const userName = order.user ? order.user.name.toLowerCase() : 'khách vãng lai';
    const orderId = order._id.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = orderId.includes(search) || userName.includes(search);
    const matchesStatus = statusFilter === 'All' || (order.isDelivered ? 'Shipped' : 'Processing') === statusFilter; 
    
    return matchesSearch;
  });

  const getStatusBadgeClass = (order) => {
    if (order.isCancelled) return 'bg-danger';
    if (order.isDelivered) return 'bg-shipped';
    if (order.isPaid) return 'bg-success';
    return 'bg-processing';
  };
  const getStatusText = (order) => {
    if (order.isCancelled) return 'Đã hủy';
    if (order.isDelivered) return 'Đã giao';
    if (order.isPaid) return 'Đã thanh toán';
    return 'Đang xử lý';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalOrders = orders.length;
  const completed = orders.filter(o => o.isDelivered).length;
  const processing = totalOrders - completed; 

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
              <li><Link to="/admin" className="menu-item"><span></span> Người Dùng</Link></li>
              <li><Link to="/admin/products" className="menu-item"><span></span> Sản Phẩm</Link></li>
              <li><Link to="/admin/orders" className="menu-item active"><span></span> Đơn Hàng</Link></li>
              <li><Link to="/admin/settings" className="menu-item"><span></span> Cài Đặt</Link></li>
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
                  <h4>Admin</h4>
                  <p>admin@binhminh.com</p>
                </div>
                <div className="admin-avatar">AD</div>
              </div>
            </div>
          </header>

          <div className="page-content-wrapper">
            <div className="page-header">
              <h2>Quản Lý Đơn Hàng</h2>
              <p>Theo dõi và xử lý đơn đặt hàng từ khách</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tổng Đơn</h3>
                <div className="value">{totalOrders}</div>
              </div>
              <div className="stat-card">
                <h3>Đang Xử Lý</h3>
                <div className="value" style={{color: '#0d6efd'}}>{processing}</div>
              </div>
              <div className="stat-card">
                <h3>Hoàn Thành</h3>
                <div className="value" style={{color: '#198754'}}>{completed}</div>
              </div>
            </div>

            <div className="order-filters">
              <input 
                type="text" 
                placeholder="Tìm theo Mã đơn, Tên khách..." 
                className="search-order"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Mã Đơn (ID)</th>
                    <th>Khách Hàng</th>
                    <th>Ngày Đặt</th>
                    <th>Trạng Thái</th>
                    <th>Tổng Tiền</th>
                    <th>Thanh Toán</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan="7" style={{textAlign: 'center'}}>Không tìm thấy đơn hàng nào.</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td><span className="order-id">#{order._id.substring(0, 10)}...</span></td>
                        <td className="cell-customer">
                          <h4>{order.user ? order.user.name : 'Người dùng đã xóa'}</h4>
                          <p>{order.user ? order.user.email : ''}</p>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`badge-status ${getStatusBadgeClass(order)}`}>
                            {getStatusText(order)}
                          </span>
                        </td>
                        <td style={{fontWeight: 'bold'}}>{formatCurrency(order.totalPrice)}</td>
                        <td>
                            {order.isPaid ? 
                                <span style={{color: 'green'}}>Đã TT ({order.paymentMethod})</span> : 
                                <span style={{color: 'red'}}>Chưa TT ({order.paymentMethod})</span>
                            }
                        </td>
                        <td>
                          <button 
                            className="btn-view-order" 
                            title="Xem chi tiết"
                            onClick={() => handleViewOrder(order)}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
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

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{width: '700px'}}>
            
            <div className="modal-header">
              <h3>Chi Tiết Đơn Hàng #{selectedOrder._id.substring(0, 10)}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <div className="order-detail-grid">
                <div className="detail-section">
                    <h4>Thông Tin Khách Hàng</h4>
                    <div className="detail-item"><strong>Tên:</strong> {selectedOrder.user?.name}</div>
                    <div className="detail-item"><strong>Email:</strong> {selectedOrder.user?.email}</div>
                    <div className="detail-item">
                        <strong>Địa chỉ:</strong> 
                        {selectedOrder.shippingAddress 
                            ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}`
                            : 'Chưa cập nhật'}
                    </div>

                    <h4 style={{marginTop: '20px'}}>Thanh Toán</h4>
                    <div className="detail-item">
                        <strong>Phương thức:</strong> {selectedOrder.paymentMethod}
                    </div>
                    <div className="detail-item">
                        <strong>Trạng thái:</strong> {selectedOrder.isPaid 
                            ? <span style={{color: 'green'}}>Đã thanh toán</span> 
                            : <span style={{color: 'red'}}>Chưa thanh toán</span>}
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Sản Phẩm ({selectedOrder.orderItems?.length || 0})</h4>
                    <div className="order-items-list">
                        {selectedOrder.orderItems && selectedOrder.orderItems.map((item, index) => (
                            <div className="order-item" key={index}>
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                    <p className="item-name">{item.name}</p>
                                    <span className="item-price">
                                        {item.qty} x {formatCurrency(item.price)}
                                    </span>
                                </div>
                                <div style={{fontWeight: 'bold'}}>
                                    {formatCurrency(item.qty * item.price)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{textAlign: 'right', marginTop: '15px', fontSize: '18px'}}>
                        <strong>Tổng cộng: {formatCurrency(selectedOrder.totalPrice)}</strong>
                    </div>
                </div>
            </div>

            <div className="modal-actions" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid #eee', 
                paddingTop: '20px', 
                marginTop: '20px'
            }}>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                        Đóng
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleDeleteOrder}
                        title="Xóa vĩnh viễn khỏi Database"
                        style={{
                            background: '#ffebee', 
                            color: '#d32f2f', 
                            border: '1px solid #ffcdd2', 
                            borderRadius: '6px',
                            padding: '0 15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        Xóa
                    </button>
                </div>

                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <span style={{fontWeight: '500', fontSize: '14px'}}>Trạng thái:</span>
                    
                    <select 
                        value={statusToUpdate}
                        onChange={(e) => setStatusToUpdate(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: statusToUpdate === 'Cancelled' ? 'red' : statusToUpdate === 'Delivered' ? 'green' : '#333'
                        }}
                    >
                        <option value="Processing">Đang xử lý</option>
                        <option value="Shipped">Đang giao hàng</option>
                        <option value="Delivered">Đã giao hàng</option>
                        <option value="Cancelled">Đã hủy (Lưu lịch sử)</option>
                    </select>

                    <button 
                        type="button" 
                        className="btn-submit" 
                        onClick={handleUpdateStatus}
                        style={{height: '38px', padding: '0 20px'}}
                    >
                        Lưu
                    </button>
                </div>
            </div>

          </div>
        </div>
      )}

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default AdminOrderPage;