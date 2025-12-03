// import React from 'react';
// import styles from '../styles/MainPage.module.css';
// import Navbar from '../components/Navbar.jsx';
// import Footer from '../components/Footer.jsx';
// import Banner from '../components/Banner.jsx';
// import ShoppingCart from '../components/ShoppingCart.jsx';
// import ShoppingCartService from '../services/ShoppingCartService.js';
// import { useState, useEffect } from 'react';

// import samsungS25 from '../assets/images/dtss.webp';
// import oppoFind from '../assets/images/Oppo find X9 Ultra.jpg';
// import xiaomi17 from '../assets/images/Xiaomi 17 pro.webp';
// import vivoX300 from '../assets/images/vivo X300 pro.webp';
// import honorMagic7 from '../assets/images/honor-magic7-pro-xam.jpg.webp';
// import googlePixel10 from '../assets/images/google-pixel-10-pro.jpg';
// import sonyXperia from '../assets/images/sony-xperia-1-vii.webp';
// import huaweiPura from '../assets/images/Huawei Pura 70 Ultra.webp';
// import nubiaZ60 from '../assets/images/nubia_z60_ultra_1.png';
// import meizu21 from '../assets/images/Meizu 21.webp';
// import oneplusAce from '../assets/images/oneplus-ace-3-genshin-impact.jpg.webp';
// import leicaLeitz from '../assets/images/leica-leitz-phone-3.webp';

// const MainPage = () => {
//   // State for shopping cart
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItemCount, setCartItemCount] = useState(0);

//   // Load cart count on component mount
//   useEffect(() => {
//     const updateCartCount = () => {
//       const cart = ShoppingCartService.loadCart();
//       const totalItems = ShoppingCartService.calculateTotalItems(cart);
//       setCartItemCount(totalItems);
//     };

//     // Initial load
//     updateCartCount();

//     // Listen for cart updates
//     const cleanup = ShoppingCartService.setupCartListener(() => {
//       updateCartCount();
//     });

//     return cleanup;
//   }, []);

//   // Functions for shopping cart
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);

//   // Handle add to cart
//   const handleAddToCart = (product) => {
//     const result = ShoppingCartService.addToCart(product);
    
//     if (result.success) {
//       console.log('Đã thêm sản phẩm:', product.name);
      
//       // Update cart count immediately
//       const cart = ShoppingCartService.loadCart();
//       const totalItems = ShoppingCartService.calculateTotalItems(cart);
//       setCartItemCount(totalItems);
//     } else {
//       console.error('Lỗi khi thêm sản phẩm:', result.message);
//     }
//   };

//   const products = [
//     {
//       id: 1,
//       image: samsungS25,
//       name: "SamSung Galaxy S25 Ultra ( Black | 12GB RAM | 256GB)",
//       currentPrice: "26,580,000₫",
//       oldPrice: "27,280,000₫"
//     },
//     {
//       id: 2,
//       image: oppoFind,
//       name: "Oppo Find X9 Pro ( Dimensity 9500| 12GB | 256GB )",
//       currentPrice: "31,890,000₫",
//       oldPrice: "33,500,000₫"
//     },
//     {
//       id: 3,
//       image: xiaomi17,
//       name: "Xiaomi 17 Pro (Snapdragon 8 Elite Gen 5 - Pin 6300mAh)",
//       currentPrice: "18,950,000₫",
//       oldPrice: "20,950,000₫"
//     },
//     {
//       id: 4,
//       image: vivoX300,
//       name: "Vivo X300 Pro (Dimensity 9200| 12GB RAM| 256GB)",
//       currentPrice: "22,950,000₫",
//       oldPrice: "24,600,000₫"
//     },
//     {
//       id: 5,
//       image: honorMagic7,
//       name: "Honor Magic 7 Pro (Snapdragon 8 Elite| 12GB RAM| 256GB)",
//       currentPrice: "17,950,000₫",
//       oldPrice: "19,950,000₫"
//     },
//     {
//       id: 6,
//       image: googlePixel10,
//       name: "Google Pixel 10 Pro (Tensor G3| 12GB RAM| 256GB)",
//       currentPrice: "26,350,000₫",
//       oldPrice: "28,500,000₫"
//     },
//     {
//       id: 7,
//       image: sonyXperia,
//       name: "Sony Xperia 1 VII (Snapdragon 8 Gen 1| 12GB RAM| 256GB)",
//       currentPrice: "33,490,000₫",
//       oldPrice: "34,990,000₫"
//     },
//     {
//       id: 8,
//       image: huaweiPura,
//       name: "Huawei Pura 70 Ultra (Kirin 9010| 16GB RAM| 512GB)",
//       currentPrice: "44,990,000₫",
//       oldPrice: "45,500,000₫"
//     },
//     {
//       id: 9,
//       image: nubiaZ60,
//       name: "Nubia Z60 Ultra (Snapdragon 8 Gen 2| 16GB RAM| 512GB)",
//       currentPrice: "39,990,000₫",
//       oldPrice: "41,500,000₫"
//     },
//     {
//       id: 10,
//       image: meizu21,
//       name: "Meizu 21 (Snapdragon 8 Gen 2| 8GB RAM| 256GB)",
//       currentPrice: "11,750,000₫",
//       oldPrice: "12,500,000₫"
//     },
//     {
//       id: 11,
//       image: oneplusAce,
//       name: "OnePlus Ace 3 (Snapdragon 8 Gen 2| 16GB RAM| 512GB)",
//       currentPrice: "11,950,000₫",
//       oldPrice: "13,000,000₫"
//     },
//     {
//       id: 12,
//       image: leicaLeitz,
//       name: "Leica Leitz Phone 3 (Snapdragon 888| 12GB RAM| 512GB)",
//       currentPrice: "40,950,000₫",
//       oldPrice: "44,676,000₫"
//     }
//   ];

//   return (
//     <div className={styles.mainPage}>
//       <Navbar />      
//       <div className={styles.spacer}></div>   
//       <Banner />
//       <div className={styles.searchBar}>
//         <input 
//           type="text" 
//           className={styles.searchInput} 
//           placeholder="Tìm kiếm sản phẩm..."
//         />
//         <button className={styles.searchButton}>Tìm kiếm</button>
//       </div>
//       <button 
//         className={styles.floatingCartBtn}
//         onClick={openCart}
//       >
//         🛒
//         {cartItemCount > 0 && (
//           <span className={styles.cartBadge}>
//             {cartItemCount}
//           </span>
//         )}
//       </button>
//       <ShoppingCart 
//         isOpen={isCartOpen}
//         onClose={closeCart}
//       />
//       <main className={styles.main}>
//         <div className={styles.productContainer}>
//           {products.map(product => (
//             <div key={product.id} className={styles.productCard}>
//               <img src={product.image} alt={product.name} />
//               <div className={styles.productInfo}>
//                 <h3 className={styles.productName}>{product.name}</h3>
//                 <div className={styles.productPrice}>
//                   <span className={styles.priceCurrent}>{product.currentPrice}</span>
//                   <span className={styles.priceOld}>{product.oldPrice}</span>
//                 </div>
//                 <button 
//                   className={styles.addToCartBtn}
//                   onClick={() => handleAddToCart(product)}
//                 >
//                   Thêm vào giỏ hàng
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>     
//       <Footer />
//     </div>
//   );
// };

// export default MainPage;





//new

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
    if (result.success) {
      alert(result.message); 
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={styles.mainPage}>
      <Navbar />      
      <div className={styles.spacer}></div>   
      <Banner />
      
      <div className={styles.searchBar}>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Tìm kiếm sản phẩm..."
        />
        <button className={styles.searchButton}>Tìm kiếm</button>
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
            // Render danh sách sản phẩm THẬT
            products.map(product => (
              <div key={product._id} className={styles.productCard}>
                <img src={product.image} alt={product.name} />
                
                <div className={styles.productInfo}>
                  <Link to={`/product/${product._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <h3 className={styles.productName}>{product.name}</h3>
                  </Link>
                  
                  <div className={styles.productPrice}>
                    <span className={styles.priceCurrent}>
                      {product.price?.toLocaleString('vi-VN')}₫
                    </span>

                  </div>
                  
                  <button 
                    className={styles.addToCartBtn}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>     
      {/* <Footer /> */}
    </div>
  );
};

export default MainPage;