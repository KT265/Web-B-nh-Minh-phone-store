class ShoppingCartService {
  // Constants
  static STORAGE_KEY = 'shopping-cart';

  /**
   * Load cart data from localStorage
   */
  static loadCart() {
    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi load giỏ hàng:', error);
      return [];
    }
  }

  /**
   * Save cart data to localStorage
   */
  static saveCart(cart) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { cart }
      }));

      return true;
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng:', error);
      return false;
    }
  }

  /**
   * Add item to cart
   */
  static addToCart(product) {
    try {
      const currentCart = this.loadCart();
      const existingItem = currentCart.find(item => item.id === product.id);

      let updatedCart;
      if (existingItem) {
        // Increase quantity if item already exists
        updatedCart = currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        const newItem = {
          ...product,
          quantity: 1,
          selected: false,
          addedAt: new Date().toISOString()
        };
        updatedCart = [...currentCart, newItem];
      }

      this.saveCart(updatedCart);
      return {
        success: true,
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi thêm sản phẩm'
      };
    }
  }

  /**
   * Remove item from cart
   */
  static removeFromCart(productId) {
    try {
      const currentCart = this.loadCart();
      const updatedCart = currentCart.filter(item => item.id !== productId);

      this.saveCart(updatedCart);
      return {
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng!',
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xóa sản phẩm'
      };
    }
  }

  /**
   * Update item quantity
   */
  static updateQuantity(productId, newQuantity) {
    try {
      if (newQuantity < 1) {
        return this.removeFromCart(productId);
      }

      const currentCart = this.loadCart();
      const updatedCart = currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      this.saveCart(updatedCart);
      return {
        success: true,
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật số lượng'
      };
    }
  }

  /**
   * Increase item quantity
   */
  static increaseQuantity(productId) {
    const currentCart = this.loadCart();
    const item = currentCart.find(item => item.id === productId);

    if (item) {
      return this.updateQuantity(productId, item.quantity + 1);
    }

    return { success: false, message: 'Không tìm thấy sản phẩm' };
  }

  /**
   * Decrease item quantity
   */
  static decreaseQuantity(productId) {
    const currentCart = this.loadCart();
    const item = currentCart.find(item => item.id === productId);

    if (item && item.quantity > 1) {
      return this.updateQuantity(productId, item.quantity - 1);
    }

    return { success: false, message: 'Số lượng không thể nhỏ hơn 1' };
  }

  /**
   * Toggle item selection
   */
  static toggleItemSelection(productId) {
    try {
      const currentCart = this.loadCart();
      const updatedCart = currentCart.map(item =>
        item.id === productId
          ? { ...item, selected: !item.selected }
          : item
      );

      this.saveCart(updatedCart);
      return {
        success: true,
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi chọn sản phẩm:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi chọn sản phẩm'
      };
    }
  }

  /**
   * Select all items
   */
  static selectAllItems() {
    try {
      const currentCart = this.loadCart();
      const updatedCart = currentCart.map(item => ({ ...item, selected: true }));

      this.saveCart(updatedCart);
      return {
        success: true,
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi chọn tất cả sản phẩm:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi chọn tất cả sản phẩm'
      };
    }
  }

  /**
   * Deselect all items
   */
  static deselectAllItems() {
    try {
      const currentCart = this.loadCart();
      const updatedCart = currentCart.map(item => ({ ...item, selected: false }));

      this.saveCart(updatedCart);
      return {
        success: true,
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi bỏ chọn tất cả sản phẩm:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi bỏ chọn tất cả sản phẩm'
      };
    }
  }

  /**
   * Get selected items only
   */
  static getSelectedItems() {
    const cart = this.loadCart();
    return cart.filter(item => item.selected);
  }

  /**
   * Calculate total price for selected items only
   */
  static calculateSelectedTotalPrice(cart) {
    return cart
      .filter(item => item.selected)
      .reduce((total, item) => {
        const price = this.parsePrice(item.currentPrice || item.price);
        return total + (price * item.quantity);
      }, 0);
  }

  /**
   * Calculate total items count for selected items only
   */
  static calculateSelectedTotalItems(cart) {
    return cart
      .filter(item => item.selected)
      .reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Clear entire cart
   */
  static clearCart() {
    try {
      this.saveCart([]);
      return {
        success: true,
        message: 'Đã xóa toàn bộ giỏ hàng!',
        cart: []
      };
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xóa giỏ hàng'
      };
    }
  }

  /**
   * Calculate total price
   */
  static calculateTotalPrice(cart) {
    return cart.reduce((total, item) => {
      const price = this.parsePrice(item.currentPrice || item.price);
      return total + (price * item.quantity);
    }, 0);
  }

  /**
   * Calculate total items count
   */
  static calculateTotalItems(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Format price to Vietnamese currency
   */
  static formatPrice(price) {
    const numericPrice = typeof price === 'string' ? this.parsePrice(price) : price;

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericPrice);
  }

  /**
   * Parse price string to number
   */
  static parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;

    // Remove currency symbols and convert to number
    return parseInt(priceString.replace(/[₫,.\s]/g, '')) || 0;
  }

  /**
   * Get cart summary (includes selected items data)
   */
  static getCartSummary(cart) {
    const selectedItems = cart.filter(item => item.selected);

    return {
      items: cart,
      selectedItems: selectedItems,
      totalItems: this.calculateTotalItems(cart),
      totalPrice: this.calculateTotalPrice(cart),
      selectedTotalItems: this.calculateSelectedTotalItems(cart),
      selectedTotalPrice: this.calculateSelectedTotalPrice(cart),
      isEmpty: cart.length === 0,
      hasSelectedItems: selectedItems.length > 0,
      allItemsSelected: cart.length > 0 && selectedItems.length === cart.length
    };
  }

  /**
   * Validate cart item
   */
  static validateCartItem(item) {
    const required = ['id', 'name', 'currentPrice'];
    const missing = required.filter(field => !item[field]);

    if (missing.length > 0) {
      return {
        isValid: false,
        errors: `Thiếu thông tin: ${missing.join(', ')}`
      };
    }

    return { isValid: true };
  }

  /**
   * Process checkout for selected items only
   */
  static processCheckout(cart, navigate = null) {
    try {
      const selectedItems = cart.filter(item => item.selected);

      if (selectedItems.length === 0) {
        return {
          success: false,
          message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán!'
        };
      }

      const summary = this.getCartSummary(cart);

      // Store selected items in localStorage for payment page
      localStorage.setItem('checkout-items', JSON.stringify(selectedItems));
      localStorage.setItem('checkout-summary', JSON.stringify({
        totalItems: summary.selectedTotalItems,
        totalPrice: summary.selectedTotalPrice
      }));

      // Navigate to payment page if navigate function is provided
      if (navigate && typeof navigate === 'function') {
        navigate('/payment');
      }

      return {
        success: true,
        message: `Đang chuyển hướng đến trang thanh toán cho ${summary.selectedTotalItems} sản phẩm đã chọn`,
        orderSummary: {
          selectedItems: selectedItems,
          totalItems: summary.selectedTotalItems,
          totalPrice: summary.selectedTotalPrice
        },
        redirected: true
      };
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý thanh toán'
      };
    }
  }

  /**
   * Handle checkout navigation
   */
  static handleCheckoutClick(navigate) {
    const cart = this.loadCart();
    return this.processCheckout(cart, navigate);
  }

  /**
   * Setup event listeners for cart updates
   */
  static setupCartListener(callback) {
    const handleCartUpdate = (event) => {
      if (callback && typeof callback === 'function') {
        callback(event.detail.cart);
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    // Return cleanup function
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }

  /**
   * Check if item exists in cart
   */
  static isItemInCart(productId) {
    const cart = this.loadCart();
    return cart.some(item => item.id === productId);
  }

  /**
   * Get item quantity in cart
   */
  static getItemQuantity(productId) {
    const cart = this.loadCart();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Get checkout data from localStorage
   */
  static getCheckoutData() {
    try {
      const items = localStorage.getItem('checkout-items');
      const summary = localStorage.getItem('checkout-summary');
      
      return {
        items: items ? JSON.parse(items) : [],
        summary: summary ? JSON.parse(summary) : null
      };
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu checkout:', error);
      return {
        items: [],
        summary: null
      };
    }
  }

  /**
   * Clear checkout data from localStorage
   */
  static clearCheckoutData() {
    try {
      localStorage.removeItem('checkout-items');
      localStorage.removeItem('checkout-summary');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu checkout:', error);
      return false;
    }
  }

  /**
   * Remove checked out items from cart
   */
  static removeCheckoutItemsFromCart() {
    try {
      const checkoutData = this.getCheckoutData();
      if (checkoutData.items.length === 0) {
        return { success: false, message: 'Không có sản phẩm checkout để xóa' };
      }

      const currentCart = this.loadCart();
      const checkoutItemIds = checkoutData.items.map(item => item.id);
      const updatedCart = currentCart.filter(item => !checkoutItemIds.includes(item.id));

      this.saveCart(updatedCart);
      this.clearCheckoutData();

      return {
        success: true,
        message: 'Đã xóa các sản phẩm đã thanh toán khỏi giỏ hàng',
        cart: updatedCart
      };
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm checkout:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xóa sản phẩm'
      };
    }
  }
}

export default ShoppingCartService;