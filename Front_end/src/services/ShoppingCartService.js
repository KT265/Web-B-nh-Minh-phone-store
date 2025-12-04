import axios from 'axios';

class ShoppingCartService {
  static API_URL = 'http://localhost:5000/api/customer/cart';
  static STORAGE_KEY = 'cart-local-cache';

  // --- PHẦN 1: KẾT NỐI SERVER & ĐỒNG BỘ ---

  static getConfig() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? (userInfo.user?.token || userInfo.token) : null;
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }

  static saveLocalCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    // Báo cho giao diện cập nhật
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
  }

  static getLocalCart() {
    try {
      const cart = localStorage.getItem(this.STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch { return []; }
  }

  static async loadCart() {
    try {
      const response = await axios.get(this.API_URL, this.getConfig());
      if (!Array.isArray(response.data)) return [];

      const localCart = this.getLocalCart();
      const cart = response.data.map(item => {
        const id = item.product._id || item.product;
        const localItem = localCart.find(i => i.id === id);
        
        return {
          ...item,
          selected: localItem ? localItem.selected : false,
          id: id,
          name: item.product.name || item.name,
          price: item.product.price || item.price,
          image: item.product.image || item.image,
          currentPrice: item.product.price || item.price,
          quantity: item.quantity
        };
      });

      this.saveLocalCart(cart);
      return cart;
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      return this.getLocalCart();
    }
  }

  static async addToCart(product, quantity = 1) {
    try {
      const payload = {
        productId: product._id || product.id,
        quantity: quantity
      };
      await axios.post(this.API_URL, payload, this.getConfig());
      return { success: true, cart: await this.loadCart() };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { success: false, message: 'Vui lòng đăng nhập' };
        }
        return { success: false, message: 'Lỗi thêm sản phẩm' };
    }
  }

  static async removeFromCart(productId) {
    try {
      await axios.delete(`${this.API_URL}/${productId}`, this.getConfig());
      return { success: true, message: 'Đã xóa', cart: await this.loadCart() };
    } catch (error) {
      return { success: false, message: 'Lỗi xóa sản phẩm' };
    }
  }

  static async updateQuantity(productId, newQuantity) {
    try {
      if (newQuantity < 1) return this.removeFromCart(productId);
      const payload = { productId, quantity: newQuantity };
      await axios.put(this.API_URL, payload, this.getConfig());
      return { success: true, message: 'Đã cập nhật', cart: await this.loadCart() };
    } catch (error) {
      return { success: false, message: 'Lỗi cập nhật' };
    }
  }

  // --- PHẦN 2: XỬ LÝ CHECKBOX ---

  static toggleItemSelection(productId) {
    const cart = this.getLocalCart();
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, selected: !item.selected } : item
    );
    this.saveLocalCart(updatedCart);
    return { success: true, cart: updatedCart };
  }

  static selectAllItems() {
    const cart = this.getLocalCart();
    const updatedCart = cart.map(item => ({ ...item, selected: true }));
    this.saveLocalCart(updatedCart);
    return { success: true, cart: updatedCart };
  }

  static deselectAllItems() {
    const cart = this.getLocalCart();
    const updatedCart = cart.map(item => ({ ...item, selected: false }));
    this.saveLocalCart(updatedCart);
    return { success: true, cart: updatedCart };
  }

  // --- PHẦN 3: HELPER (CÁC HÀM TÍNH TOÁN BẠN ĐANG THIẾU) ---

  static setupCartListener(callback) {
    const handleCartUpdate = (event) => {
        if (callback && typeof callback === 'function') {
            if (event.detail && event.detail.cart) {
                callback(event.detail.cart);
            } else {
                this.loadCart().then(cart => callback(cart));
            }
        }
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }

  // 👇 HÀM BẠN ĐANG BỊ LỖI LÀ HÀM NÀY 👇
  static calculateTotalItems(cart) {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  static calculateTotalPrice(cart) {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      const price = this.parsePrice(item.currentPrice || item.price);
      return total + (price * item.quantity);
    }, 0);
  }

  static calculateSelectedTotalPrice(cart) {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.filter(item => item.selected)
      .reduce((total, item) => total + (this.parsePrice(item.currentPrice || item.price) * item.quantity), 0);
  }

  static calculateSelectedTotalItems(cart) {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.filter(item => item.selected).reduce((total, item) => total + item.quantity, 0);
  }

  static getCartSummary(cart) {
    if (!cart || !Array.isArray(cart)) cart = [];
    const selectedItems = cart.filter(item => item.selected);

    return {
      items: cart,
      selectedItems,
      totalItems: this.calculateTotalItems(cart),
      totalPrice: this.calculateTotalPrice(cart),
      selectedTotalItems: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      selectedTotalPrice: this.calculateSelectedTotalPrice(cart),
      isEmpty: cart.length === 0,
      hasSelectedItems: selectedItems.length > 0,
      allItemsSelected: cart.length > 0 && selectedItems.length === cart.length
    };
  }

  static formatPrice(price) {
    const numericPrice = typeof price === 'string' ? this.parsePrice(price) : price;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
  }
  
  static parsePrice(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseInt(price.toString().replace(/[₫,.\s]/g, '')) || 0;
  }

  // --- CHECKOUT ---
  static processCheckout(cart, navigate) {
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    const summary = {
        totalPrice: this.calculateSelectedTotalPrice(cart),
        totalItems: selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    };
    localStorage.setItem('checkout-items', JSON.stringify(selectedItems));
    localStorage.setItem('checkout-summary', JSON.stringify(summary));
    if (navigate) navigate('/payment');
    return { success: true };
  }

  static getCheckoutData() {
    try {
      return { 
        items: JSON.parse(localStorage.getItem('checkout-items') || '[]'), 
        summary: JSON.parse(localStorage.getItem('checkout-summary') || 'null') 
      };
    } catch { return { items: [], summary: null }; }
  }

  static clearCheckoutData() {
    localStorage.removeItem('checkout-items');
    localStorage.removeItem('checkout-summary');
  }
  
  static removeCheckoutItemsFromCart() {
      this.clearCheckoutData();
      this.deselectAllItems();
  }
}

export default ShoppingCartService;