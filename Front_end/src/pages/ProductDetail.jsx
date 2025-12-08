import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/ProductDetail.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShoppingCartService from '../services/ShoppingCartService.js';
import ShoppingCart from '../components/ShoppingCart.jsx';
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  

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

  useEffect(() => {
    const updateCartCount = async () => {
      const cart = await ShoppingCartService.loadCart();
      const totalItems = ShoppingCartService.calculateTotalItems(cart);
      setCartItemCount(totalItems);
    };

    updateCartCount();
    const cleanup = ShoppingCartService.setupCartListener((updatedCart) => {
      const totalItems = ShoppingCartService.calculateTotalItems(updatedCart);
      setCartItemCount(totalItems);
    });
    return cleanup;
  }, []);

  // Functions for shopping cart
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleAddToCart = async (product) => {
    // Gọi hàm async từ Service
    const result = await ShoppingCartService.addToCart(product);
    
    if (result.error) {
      alert(result.error);
    }
  };


  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Đang tải...</p>;
  if (error) return <p style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Lỗi: {error}</p>;
  if (!product) return <p style={{textAlign: 'center', marginTop: '50px'}}>Không tìm thấy sản phẩm</p>;

  return (
    <div className={styles.ProductDetailPage}>
      <Navbar />
      <div className={styles.productDetailContainer}>
        <div className={styles.ProductInfo}> 
          <img src={product.image} alt={product.name} />
          <div className={styles.ProductDetail}>
            <h1>{product.name}</h1>
            <div className={styles.BroadProductDetailInfo}>
              <ul>
                <li className={styles.ListInfo}><strong style={{marginRight:'50px'}}>CPU: </strong>{product.specifications?.cpu}</li>
                <li className={styles.ListInfo}><strong>Màn hình: </strong>{product.specifications?.display}</li>
                <li className={styles.ListInfo}><strong>Ram: </strong>{product.specifications?.ram}</li>
                <li className={styles.ListInfo}><strong>Bộ nhớ: </strong>{product.specifications?.storage}</li> 
                <li className={styles.ListInfo}><strong>Camera: </strong>{product.specifications?.camera}</li>        
              </ul>
              <div className={styles.productPrice}>
                <span className={styles.priceCurrent}>
                  {product.price?.toLocaleString('vi-VN')}₫
                </span>
                {product.priceOld && (
                  <span className={styles.priceOld}>
                    {product.priceOld?.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>     
            </div>
          </div>
          <button 
            className={styles.addToCartBtn}
            onClick={() => handleAddToCart(product)}
            >
            Thêm vào giỏ hàng
          </button>
        </div>

        {/* <div style={{ flex: 1 }}>
            <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
            />
        </div> */}

        {/* Thông tin sản phẩm */}
        {/* <div style={{ flex: 1 }}>
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
        </div> */}
      </div>
      <button 
          className={styles.floatingCartBtn}
          onClick={openCart}
        >
          🛒
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>
              {cartItemCount}
            </span>
          )}
        </button>
        
        <ShoppingCart 
          isOpen={isCartOpen}
          onClose={closeCart}
        />
    </div>
  );
};

export default ProductDetailPage;