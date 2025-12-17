
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

  // State cho bộ lọc 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  //Lấy danh sách thương hiệu
  const brands = ['all', ...new Set(products.map(p => p.brand).filter(Boolean))];
  //Bộ lọc
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = product.price || 0;
      switch(priceRange) {
        case 'under5':
          matchesPrice = price < 5000000;
          break;
        case '5to10':
          matchesPrice = price >= 5000000 && price < 10000000;
          break;
        case '10to20':
          matchesPrice = price >= 10000000 && price < 20000000;
          break;
        case 'over20':
          matchesPrice = price >= 20000000;
          break;
        default:
          matchesPrice = true;
      }
    }
    return matchesSearch && matchesBrand && matchesPrice;
  });

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

  //Reset bộ lọc
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
    setPriceRange('all');
  };

  return (
    <div className={styles.ProductList}>
      <Navbar/>
      <main className={styles.main}>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Tìm kiếm:</label>
            <input 
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Thương hiệu:</label>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              {brands.filter(b => b !== 'all').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Mức giá:</label>
            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value="under5">Dưới 5 triệu</option>
              <option value="5to10">5 - 10 triệu</option>
              <option value="10to20">10 - 20 triệu</option>
              <option value="over20">Trên 20 triệu</option>
            </select>
          </div>
          <button onClick={resetFilters} className={styles.resetBtn}>
            Xóa bộ lọc
          </button>
        </div>

        <button className={styles.ButtonGotocompare} onClick={navigateToCompare} disabled={selectedIds.length < 2 || selectedIds.length > 3}>
          ⚖️
          <span className={styles.selectedIds}>
            {selectedIds.length}
          </span>
        </button>

        <div className={styles.container}>
          {loading && <div style={{textAlign: 'center', padding: '20px'}}>Đang tải sản phẩm...</div>}
          {error && <div className={styles.error}>Lỗi: {error}</div>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div style={{textAlign: 'center', padding: '20px', width: '100%'}}>
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
            </div>
          )}
          {!loading && !error && filteredProducts.length > 0 && (
              filteredProducts.map(product => (
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