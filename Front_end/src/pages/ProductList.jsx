// import React, {useState, useEffect} from "react";
// import styles from '../styles/ProductList.module.css';
// import Navbar from '../components/Navbar.jsx';
// import Footer from '../components/Footer.jsx';
// import ShoppingCart from "../components/ShoppingCart.jsx";
// import productService from '../services/ProductService.js';
// import ShoppingCartService from "../services/ShoppingCartService.js";
// import { set } from "mongoose";


// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // useEffect(() => {
//   //     const fetchProducts = async () => {
//   //       setLoading(true);
//   //       const result = await ProductService.getProducts();
//   //       if (result.success) {
//   //         setProducts(result.data);
//   //       }
//   //       else {
//   //         setError('Không tải được sản phẩm');
//   //       }
//   //       setLoading(false);
//   //     };
//   //     fetchProducts();
//   // }, []);
//   // if (loading) {
//   //     return <div>Đang tải sản phẩm...</div>;
//   // }
//   // if (error) {
//   //     return <div>Lỗi: {error}</div>;
//   // }
 
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
//   // Load products from API
//   useEffect(() => {
//     let mounted = true;

//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await productService.getProducts();
//         if (res.success) {
//           if (mounted) setProducts(res.data || []);
//         } else {
//           if (mounted) setError(res.message || 'Không tải được sản phẩm');
//         }
//       } catch (err) {
//         if (mounted) setError(err.message || 'Lỗi khi tải sản phẩm');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchProducts();

//     return () => { mounted = false; };
//   }, []);

//   return (
//     <div className={styles.ProductList}>
//       <Navbar/>

//       <div className={styles.container}>
            
//         {loading && <div>Đang tải sản phẩm...</div>}
//         {error && <div className={styles.error}>Lỗi: {error}</div>}

//         {!loading && !error && (
//           <div className={styles.productGrid}>
//             {products.map(product => (
//               <div key={product.id || product.name} className={styles.productCard}>
//                 {product.image ? (
//                   <img src={product.image} alt={product.name} className={styles.productImage} />
//                 ) : (
//                   <div className={styles.noImage}>No image</div>
//                 )}
//                 <div className={styles.productInfo}>
//                   <h3 className={styles.productName}>{product.name}</h3>
//                   <div className={styles.productPrice}>
//                     <span className={styles.priceCurrent}>{product.currentPrice}</span>
//                     {product.oldPrice && <span className={styles.priceOld}>{product.oldPrice}</span>}
//                   </div>
//                   <div className={styles.productActions}>
//                     <button className={styles.addToCartBtn} onClick={() => handleAddToCart(product)}>
//                       Thêm vào giỏ hàng
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
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

//       <Footer/>
//     </div>
    
//   );
// };

// export default ProductList;    





import React, { useState, useEffect } from "react";
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
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={styles.ProductList}>
      <Navbar/>

      <div className={styles.container}>
        {loading && <div style={{textAlign: 'center', padding: '20px'}}>Đang tải sản phẩm...</div>}
        {error && <div className={styles.error}>Lỗi: {error}</div>}

        {!loading && !error && (
          <div className={styles.productGrid}>
            {products.map(product => (
              <div key={product._id} className={styles.productCard}>
                {product.image ? (
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                ) : (
                  <div className={styles.noImage}>No image</div>
                )}
                
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productPrice}>
                    {/* Hiển thị giá từ DB (field 'price') */}
                    <span className={styles.priceCurrent}>
                        {product.price?.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  
                  <div className={styles.productActions}>
                    <button 
                        className={styles.addToCartBtn} 
                        onClick={() => handleAddToCart(product)}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
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

      <Footer/>
    </div>
  );
};

export default ProductList;