import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ShoppingCart.module.css';
import ShoppingCartService from '../services/ShoppingCartService.js';

const ShoppingCart = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart when component mounts or opens
  useEffect(() => {
    if (isOpen) {
      const cartData = ShoppingCartService.loadCart();
      setCart(cartData);
    }

    // Setup cart update listener
    const cleanup = ShoppingCartService.setupCartListener((updatedCart) => {
      if (isOpen) {
        setCart(updatedCart);
      }
    });

    return cleanup;
  }, [isOpen]);

  // Handle quantity increase
  const handleIncreaseQuantity = (id) => {
    const result = ShoppingCartService.increaseQuantity(id);
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (id) => {
    const result = ShoppingCartService.decreaseQuantity(id);
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    const result = ShoppingCartService.removeFromCart(id);
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle item selection toggle
  const handleToggleSelection = (id) => {
    const result = ShoppingCartService.toggleItemSelection(id);
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle select all items
  const handleSelectAll = () => {
    const result = ShoppingCartService.selectAllItems();
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle deselect all items
  const handleDeselectAll = () => {
    const result = ShoppingCartService.deselectAllItems();
    if (result.success) {
      setCart(result.cart);
    }
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      const result = ShoppingCartService.clearCart();
      if (result.success) {
        setCart(result.cart);
      }
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    setLoading(true);

    try {
      const result = ShoppingCartService.handleCheckoutClick(navigate);

      if (result.success) {
        if (result.redirected) {
          // Close cart before navigating
          onClose();
        } else {
          alert(result.message);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Get cart summary
  const cartSummary = ShoppingCartService.getCartSummary(cart);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Cart Sidebar */}
      <div className={styles.cartSidebar}>
        {/* Header */}
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>
            🛒 Giỏ hàng của bạn
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className={styles.cartBody}>
          {cartSummary.isEmpty ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyText}>Giỏ hàng trống</p>
              <p className={styles.emptySubtext}>Hãy thêm sản phẩm vào giỏ hàng!</p>
            </div>
          ) : (
            <>
              {/* Select All Controls */}
              <div className={styles.selectAllContainer}>
                <label className={styles.selectAllLabel}>
                  <input
                    type="checkbox"
                    className={styles.selectAllCheckbox}
                    checked={cartSummary.allItemsSelected}
                    onChange={cartSummary.allItemsSelected ? handleDeselectAll : handleSelectAll}
                  />
                  <span className={styles.selectAllText}>
                    {cartSummary.allItemsSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </span>
                </label>

                {cartSummary.hasSelectedItems && (
                  <span className={styles.selectedCount}>
                    ({cartSummary.selectedTotalItems} sản phẩm đã chọn)
                  </span>
                )}
              </div>

              <div className={styles.cartItemsContainer}>
                {cart.map(item => (
                  <div key={item.id} className={`${styles.cartItem} ${item.selected ? styles.selectedItem : ''}`}>
                    {/* Selection Checkbox */}
                    <div className={styles.itemSelection}>
                      <input
                        type="checkbox"
                        className={styles.itemCheckbox}
                        checked={item.selected || false}
                        onChange={() => handleToggleSelection(item.id)}
                      />
                    </div>

                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      {item.brand && (
                        <p className={styles.itemBrand}>{item.brand}</p>
                      )}
                      {item.storage && (
                        <p className={styles.itemStorage}>Dung lượng: {item.storage}</p>
                      )}
                      <p className={styles.itemPrice}>
                        {ShoppingCartService.formatPrice(item.currentPrice || item.price)}
                      </p>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          −
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(item.id)}
                        title="Xóa sản phẩm"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      Tổng: <span className={styles.itemTotalPrice}>
                        {ShoppingCartService.formatPrice(
                          ShoppingCartService.parsePrice(item.currentPrice || item.price) * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <button className={styles.clearCartButton} onClick={handleClearCart}>
                Xóa toàn bộ giỏ hàng
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!cartSummary.isEmpty && (
          <div className={styles.cartFooter}>
            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tổng số sản phẩm:</span>
                <span className={styles.totalValue}>{cartSummary.totalItems} sản phẩm</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Sản phẩm đã chọn:</span>
                <span className={styles.totalValue}>{cartSummary.selectedTotalItems} sản phẩm</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tạm tính:</span>
                <span className={styles.totalPrice}>
                  {ShoppingCartService.formatPrice(cartSummary.selectedTotalPrice)}
                </span>
              </div>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={loading || !cartSummary.hasSelectedItems}
            >
              {loading ? 'Đang xử lý...' : `Thanh toán (${cartSummary.selectedTotalItems})`}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;