
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Banner from '../components/Banner.jsx';
import ShoppingCart from '../components/ShoppingCart.jsx';
import ShoppingCartService from '../services/ShoppingCartService.js';

const MainPage = () => {
  // 1. State lưu dữ liệu thật từ Server
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  // State cho giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 2. Load dữ liệu khi vào trang
  useEffect(() => {
    // Hàm lấy sản phẩm thật
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API Backend
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const updateCartCount = async () => {
      const cart = await ShoppingCartService.loadCart();
      const totalItems = ShoppingCartService.calculateTotalItems(cart);
      setCartItemCount(totalItems);
    };

    updateCartCount();

    // Lắng nghe sự kiện update giỏ hàng
    const cleanup = ShoppingCartService.setupCartListener((updatedCart) => {
      const totalItems = ShoppingCartService.calculateTotalItems(updatedCart);
      setCartItemCount(totalItems);
    });

    return cleanup;
  }, []);

  // Các hàm xử lý giỏ hàng
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleAddToCart = async (product) => {
    const result = await ShoppingCartService.addToCart(product);
    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div className={styles.mainPage}>
      <Navbar />      
      <Banner />
      <div className={styles.searchArea}>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className={styles.productGrid}>
            {filteredProducts.length === 0 ? (<p style={{textAlign: 'center'}}>Không tìm thấy sản phẩm nào.</p>): null}
            {filteredProducts.slice(0,3).map(product => (
              <Link to={`/product/${product._id}`}  style={{textDecoration: 'none', color: 'inherit'}} >  
                <div className={styles.productcard} key={product._id}>
                  <img src={product.image} alt= {product.name}/>
                  <div className={styles.productinfo}>
                    <h3>{product.name}</h3>
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
              </Link>
            ))}
          </div>
        )}
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
      <main className={styles.main}>
        <div className={styles.productContainer}>
          {loading ? (
            <p style={{textAlign: 'center', width: '100%', padding: '20px'}}>Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', width: '100%', padding: '20px'}}>
              <p>Chưa có sản phẩm nào trong kho.</p>
              <p style={{color: 'gray', fontSize: '14px'}}>
                (Hãy thêm sản phẩm vào Database MongoDB Atlas)
              </p>
            </div>
          ) : (
            products.slice(0, 12).map(product => (   
              <div key={product._id} className={styles.productCard}>
                <Link to={`/product/${product._id}`}  style={{textDecoration: 'none', color: 'inherit'}} >
                  <div className={styles.productContent}>
                    <img src={product.image} alt={product.name} />
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
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
                </Link>
                <button 
                  className={styles.addToCartBtn}
                  onClick={() => handleAddToCart(product)}
                  >
                  Thêm vào giỏ hàng
                </button>
              </div>  
            ))
          )}
        </div>
      </main> 
    </div>
  );
};

export default MainPage;