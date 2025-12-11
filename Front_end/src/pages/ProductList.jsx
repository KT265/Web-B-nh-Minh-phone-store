
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/ProductList.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShoppingCart from "../components/ShoppingCart.jsx";
import ShoppingCartService from "../services/ShoppingCartService.js";
import axios from "axios"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // State cho giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Không tải được sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCartCount = async () => {

      const cart = await ShoppingCartService.loadCart();
      const totalItems = ShoppingCartService.calculateTotalItems(cart);
      setCartItemCount(totalItems);
    };

    updateCartCount();

    // Lắng nghe sự kiện update
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

  // Compare selection handlers
  const toggleSelect = (productId) => {
    setSelectedIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 3) {
        alert('Bạn chỉ có thể chọn tối đa 3 sản phẩm để so sánh');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const navigate = useNavigate();
  const navigateToCompare = () => {
    if (selectedIds.length < 2 || selectedIds.length > 3) {
      alert('Vui lòng chọn 2 hoặc 3 sản phẩm để so sánh');
      return;
    }
    const idsParam = selectedIds.join(',');
    navigate(`/compare?ids=${idsParam}`);
  };

  return (
    <div className={styles.ProductList}>
      <Navbar/>
      <main className={styles.main}>
        <button className={styles.ButtonGotocompare} onClick={navigateToCompare} disabled={selectedIds.length < 2 || selectedIds.length > 3}>
          ⚖️
          <span className={styles.selectedIds}>
            {selectedIds.length}
          </span>
        </button>

        <div className={styles.container}>
          {loading && <div style={{textAlign: 'center', padding: '20px'}}>Đang tải sản phẩm...</div>}
          {error && <div className={styles.error}>Lỗi: {error}</div>}

          {!loading && !error && (
              products.map(product => (
                <div key={product._id} className={styles.productCard}>
                  <label className={styles.compareCheckbox}>
                    <input type="checkbox" checked={selectedIds.includes(product._id)} onChange={() => toggleSelect(product._id)} />
                  </label>
                  <Link to={`/product/${product._id}`}  style={{textDecoration: 'none', color: 'inherit'}}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className={styles.productImage} />
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                    
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
      </main>
    </div>
  );
};

export default ProductList;