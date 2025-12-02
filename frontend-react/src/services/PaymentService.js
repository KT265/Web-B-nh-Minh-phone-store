import ShoppingCartService from './ShoppingCartService.js';

class PaymentService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/payments';
        this.paymentMethods = [
            { id: 'cash', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
            { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
            { id: 'bank', name: 'Chuyển khoản', icon: '🏦' },
        ];
    }

    /**
     * Get checkout data from localStorage
     */
    getCheckoutData() {
        return ShoppingCartService.getCheckoutData();
    }

    /**
     * Get payment methods
     */
    getPaymentMethods() {
        return this.paymentMethods;
    }

    /**
     * Validate customer information
     */
    validateCustomerInfo(customerInfo) {
        const errors = {};

        if (!customerInfo.fullName || customerInfo.fullName.trim().length < 2) {
            errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        }

        if (!customerInfo.phone || !/^[0-9]{10,11}$/.test(customerInfo.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        if (!customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!customerInfo.address || customerInfo.address.trim().length < 10) {
            errors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
        }

        if (!customerInfo.paymentMethod) {
            errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Process payment
     */
    async processPayment(customerInfo, checkoutData) {
        try {
            const validation = this.validateCustomerInfo(customerInfo);
            
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            if (!checkoutData.items || checkoutData.items.length === 0) {
                return {
                    success: false,
                    message: 'Không có sản phẩm để thanh toán'
                };
            }

            // Simulate API call
            await this.simulateApiCall();

            // Create order data
            const orderData = {
                orderId: this.generateOrderId(),
                customerInfo,
                items: checkoutData.items,
                summary: checkoutData.summary,
                orderDate: new Date().toISOString(),
                status: 'pending'
            };

            // Save order to localStorage (in real app, this would be sent to backend)
            this.saveOrder(orderData);

            // Remove items from cart after successful payment
            ShoppingCartService.removeCheckoutItemsFromCart();

            return {
                success: true,
                message: 'Đặt hàng thành công!',
                orderData
            };

        } catch (error) {
            console.error('Payment error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra trong quá trình thanh toán'
            };
        }
    }

    /**
     * Generate order ID
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD${timestamp}${random}`;
    }

    /**
     * Save order to localStorage
     */
    saveOrder(orderData) {
        try {
            const orders = this.getOrders();
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    /**
     * Get all orders
     */
    getOrders() {
        try {
            const orders = localStorage.getItem('orders');
            return orders ? JSON.parse(orders) : [];
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    /**
     * Simulate API call delay
     */
    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    /**
     * Format price
     */
    formatPrice(price) {
        return ShoppingCartService.formatPrice(price);
    }

    /**
     * Handle form input changes
     */
    handleInputChange(formData, setFormData, e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    /**
     * Handle form submission
     */
    async handleSubmit(formData, setErrors, setLoading, setMessage, navigate) {
        try {
            setLoading(true);
            setErrors({});
            setMessage('');

            const checkoutData = this.getCheckoutData();
            const result = await this.processPayment(formData, checkoutData);

            if (result.success) {
                setMessage(result.message);
                // Navigate to success page or home after a delay
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setMessage(result.message || 'Thanh toán thất bại');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Handle back to cart navigation
     */
    handleBackToCart(navigate) {
        navigate('/');
    }
}

export default new PaymentService();