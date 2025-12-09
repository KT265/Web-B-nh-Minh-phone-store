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
          <div className={styles.ProductInfoLeft}>
            <img src={product.image} alt={product.name} />
            <button
              className={styles.addToCartBtn}
              onClick={() => handleAddToCart(product)}
              >
              Thêm vào giỏ hàng
            </button>
          </div>
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
            <div className={styles.PromotionsProduct}>
              <h3>SĂN SALE HẾT Ý TẠI BÌNH MINH MOBILE!</h3>
              <ul className={styles.totallist}>
                <li><strong>🎁 Giảm giá trực tiếp:</strong>
                  <ul className={styles.PromotionsSections}>
                    <li>Giảm ngay <strong>500.000đ - 2.000.000đ</strong> tiền mặt tùy theo giá trị từng dòng máy.</li>
                    <li>Flash Sale giờ vàng (12h - 14h hàng ngày): Giảm thêm <strong>5%</strong> trên tổng hóa đơn.</li>
                  </ul>
                </li>
                <li><strong>🎁 Combo quà tặng phụ kiện:</strong>
                  <ul className={styles.PromotionsSections}>
                    <li>Tặng trọn bộ: <strong>Cốc sạc nhanh 20W + Cáp sạc chính hãng + Ốp lưng thời trang.</strong></li>
                    <li>Miễn phí dán cường lực cao cấp trọn đời máy (trị giá 300.000đ).</li>
                    <li>Tặng tai nghe Bluetooth hoặc Sạc dự phòng cho các hóa đơn trên 10 triệu đồng.</li>
                  </ul>
                </li>
                <li><strong>🎁 Trợ giá & Thu cũ đổi mới:</strong>
                  <ul className={styles.PromotionsSections}>
                    <li>Trợ giá lên đời: Tặng thêm <strong>1.000.000đ</strong> khi khách hàng tham gia chương trình "Thu cũ đổi mới".</li>
                  </ul>
                </li>
                <li><strong>🎁 Ưu đãi tài chính:</strong>
                  <ul className={styles.PromotionsSections}>
                    <li>Trả góp <strong>0% lãi suất</strong>: Chỉ cần CCCD, không cần chứng minh thu nhập, trả trước 0 đồng rinh máy về ngay.</li>
                  </ul>
                </li>
                <li><strong>🎁 Đặc quyền sinh viên:</strong>
                  <ul className={styles.PromotionsSections}>
                    <li>Giảm thêm <strong>200.000đ </strong> cho học sinh, sinh viên.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
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