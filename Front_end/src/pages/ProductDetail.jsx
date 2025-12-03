import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShoppingCartService from '../services/ShoppingCartService.js'; // Import service giỏ hàng

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết sản phẩm
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;
    
    const result = await ShoppingCartService.addToCart(product);
    
    if (result.success) {
      alert("Đã thêm vào giỏ hàng thành công!");
    } else {
      alert(result.message); // Ví dụ: "Vui lòng đăng nhập"
    }
  };

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Đang tải...</p>;
  if (error) return <p style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Lỗi: {error}</p>;
  if (!product) return <p style={{textAlign: 'center', marginTop: '50px'}}>Không tìm thấy sản phẩm</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px' }}>
        {/* Ảnh sản phẩm */}
        <div style={{ flex: 1 }}>
            <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ flex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>← Quay lại</Link>
            <h1 style={{ marginTop: '10px', fontSize: '32px' }}>{product.name}</h1>
            <h2 style={{ color: '#d70018', fontSize: '28px' }}>
                {product.price?.toLocaleString('vi-VN')} đ
            </h2>
            <p style={{ lineHeight: '1.6', color: '#333' }}>{product.description}</p>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Thông số kỹ thuật:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}><strong>Màn hình:</strong> {product.specifications?.display}</li>
                    <li style={{ marginBottom: '8px' }}><strong>Camera:</strong> {product.specifications?.camera}</li>
                    <li style={{ marginBottom: '8px' }}><strong>RAM:</strong> {product.specifications?.ram}</li>
                    <li style={{ marginBottom: '8px' }}><strong>Bộ nhớ:</strong> {product.specifications?.storage}</li>
                </ul>
            </div>
            
            <button 
                onClick={handleAddToCart}
                style={{ 
                    marginTop: '30px', 
                    padding: '15px 40px', 
                    fontSize: '18px', 
                    backgroundColor: '#5b9094', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                Thêm vào giỏ hàng
            </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;