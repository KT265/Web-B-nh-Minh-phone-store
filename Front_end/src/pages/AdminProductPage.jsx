import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/AdminProductPage.css';
import '../styles/AdminPage.css'; 

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  //state cho modal và form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Electronics',
    countInStock: '',
    description: ''
  });
  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  //Form thêm sản phẩm
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/products', formData, config);

      setProducts([data, ...products]); 
      
      setShowModal(false);
      setFormData({
        name: '', price: '', image: '', category: 'Electronics', countInStock: '', description: ''
      });
      alert('Thêm sản phẩm thành công!');

    } catch (error) {
      console.error(error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };


  // Logic Lọc sản phẩm
  const filteredProducts = products.filter(product => {
    // Tìm theo tên
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Tìm theo danh mục
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Tính toán thống kê
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.countInStock < 10 && p.countInStock > 0).length;
  const outOfStock = products.filter(p => p.countInStock === 0).length;
  const activeProducts = totalProducts - outOfStock;

  // Format tiền tệ
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
              <li>
                <Link to="/admin" className="menu-item">
                  <span></span> Người Dùng
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="menu-item active">
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
            </div>
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
            
            <div className="page-header-actions">
                <div>
                    <h2>Quản Lý Sản Phẩm</h2>
                    <p>Quản lý kho hàng và danh sách sản phẩm</p>
                </div>
                <button className="btn-add-product" onClick={() => setShowModal(true)}>
                    <span>+</span> Thêm Sản Phẩm Mới
                </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tổng Sản Phẩm</h3>
                <div className="value">{totalProducts}</div>
              </div>
              <div className="stat-card">
                <h3>Đang Kinh Doanh</h3>
                <div className="value">{activeProducts}</div>
              </div>
              <div className="stat-card">
                <h3>Sắp Hết Hàng</h3>
                <div className="value" style={{color: '#ffc107'}}>{lowStock}</div>
              </div>
              <div className="stat-card">
                <h3>Hết Hàng</h3>
                <div className="value" style={{color: '#dc3545'}}>{outOfStock}</div>
              </div>
            </div>

            <div className="product-filters">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="search-full-width"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="category-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All">Tất cả danh mục</option>
                    <option value="Electronics">LapTop</option>
                    <option value="Phone">Điện thoại</option>
                    <option value="Accessories">Phụ kiện</option>
                </select>
            </div>

            {loading ? (
                <p style={{textAlign: 'center'}}>Đang tải sản phẩm...</p>
            ) : filteredProducts.length === 0 ? (
                <p style={{textAlign: 'center'}}>Không tìm thấy sản phẩm nào.</p>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div className="product-card" key={product._id}>
                            <img 
                                src={product.image || 'https://via.placeholder.com/300'} 
                                alt={product.name} 
                                className="card-img-top" 
                            />
                            
                            <div className="card-body">
                                <div className="card-header-row">
                                    <h4 className="product-title" title={product.name}>{product.name}</h4>
                                    <button style={{background:'none', border:'none', cursor:'pointer'}}>⋮</button>
                                </div>
                                <p className="product-category">{product.category || 'Chưa phân loại'}</p>
                                
                                <div className="price-status-row">
                                    <div className="product-price">{formatCurrency(product.price)}</div>
                                    <span className={`status-badge ${product.countInStock > 0 ? 'status-active' : 'status-out'}`}>
                                        {product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>

                                <div className="card-divider"></div>

                                <div className="info-row">
                                    <span>Kho: <b>{product.countInStock}</b></span>
                                    <span>Đã bán: <b>{product.numReviews || 0}</b></span> 
                                </div>

                                <div className="card-actions">
                                    <button className="btn-action btn-edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                                        Sửa
                                    </button>
                                    <button className="btn-action btn-view">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="btn-action btn-delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
          </div>
        </div>
      </div>


      {/* form thêm sản phẩm */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>Thêm Sản Phẩm Mới</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input 
                  type="text" name="name" required 
                  value={formData.name} onChange={handleInputChange} 
                  placeholder="Ví dụ: iPhone 15 Pro Max"
                />
              </div>

              <div className="form-group" style={{display: 'flex', gap: '15px'}}>
                <div style={{flex: 1}}>
                  <label>Giá (VNĐ)</label>
                  <input 
                    type="number" name="price" required 
                    value={formData.price} onChange={handleInputChange} 
                  />
                </div>
                <div style={{flex: 1}}>
                  <label>Số lượng kho</label>
                  <input 
                    type="number" name="countInStock" required 
                    value={formData.countInStock} onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Phone">Điện Thoại</option>
                  <option value="Accessories">Phụ Kiện</option>
                  <option value="Laptop">Laptop</option>
                </select>
              </div>

              <div className="form-group">
                <label>Link Ảnh (URL)</label>
                <input 
                  type="text" name="image" required 
                  value={formData.image} onChange={handleInputChange} 
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  rows="3" name="description" 
                  value={formData.description} onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-submit">Lưu Sản Phẩm</button>
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

export default AdminProductPage;