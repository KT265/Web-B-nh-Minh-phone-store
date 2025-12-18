// import axios from 'axios';
// import ShoppingCartService from './ShoppingCartService.js';

// class PaymentService {
//     constructor() {
//         this.apiUrl = 'http://localhost:5000/api';
//         this.paymentMethods = [
//             { id: 'COD', name: 'Thanh toán khi nhận hàng (COD)'},
//             { id: 'VNPAY', name: 'Thanh toán qua VNPAY' },
//         ];
//     }

//     // Lấy danh sách phương thức thanh toán
//     getPaymentMethods() {
//         return this.paymentMethods;
//     }

//     // Lấy dữ liệu checkout từ localStorage (do ShoppingCartService lưu)
//     getCheckoutData() {
//         return ShoppingCartService.getCheckoutData();
//     }

 
//     validateCustomerInfo(customerInfo) {
//         const errors = {};
//         if (!customerInfo.fullName || customerInfo.fullName.trim().length < 2) {
//             errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
//         }
//         if (!customerInfo.phone || !/^[0-9]{10,11}$/.test(customerInfo.phone)) {
//             errors.phone = 'Số điện thoại không hợp lệ';
//         }
//         if (!customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
//             errors.email = 'Email không hợp lệ';
//         }
//         if (!customerInfo.address || customerInfo.address.trim().length < 5) {
//             errors.address = 'Vui lòng nhập địa chỉ cụ thể';
//         }
//         if (!customerInfo.paymentMethod) {
//             errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
//         }
//         return {
//             isValid: Object.keys(errors).length === 0,
//             errors
//         };
//     }

//     // Xử lý thay đổi input form
//     handleInputChange(formData, setFormData, e) {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     }

//     // Quay lại trang chủ hoặc giỏ hàng
//     handleBackToCart(navigate) {
//         navigate('/'); 
//     }

//     // GỬI ĐƠN HÀNG LÊN SERVER
//     async handleSubmit(formData, setErrors, setLoading, setMessage, navigate) {
//         setLoading(true);
//         setErrors({});
//         setMessage('');

//         try {
//             // 1. Validate dữ liệu đầu vào
//             const validation = this.validateCustomerInfo(formData);
//             if (!validation.isValid) {
//                 setErrors(validation.errors);
//                 setLoading(false);
//                 return;
//             }

//             // 2. Lấy Token từ localStorage
//             const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//             const token = userInfo ? userInfo.token : null;

//             if (!token) {
//                 setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//                 // Có thể navigate('/login') ở đây nếu muốn
//                 setLoading(false);
//                 return;
//             }

//             // 3. Lấy thông tin giỏ hàng (Tổng tiền)
//             const checkoutData = this.getCheckoutData();
//             if (!checkoutData || !checkoutData.summary) {
//                 setMessage('Giỏ hàng trống hoặc lỗi dữ liệu');
//                 setLoading(false);
//                 return;
//             }

//             // 4. Chuẩn bị dữ liệu gửi lên Backend (Mapping đúng với Order Model)
//             const orderData = {
//                 shippingAddress: {
//                     address: formData.address,
//                     city: 'Vietnam', // Backend yêu cầu city, tạm thời hardcode hoặc thêm input
//                     phone: formData.phone,
//                 },
//                 paymentMethod: formData.paymentMethod,
//                 totalPrice: checkoutData.summary.totalPrice, // Lấy tổng tiền đã tính
//             };

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`, // Gửi vé thông hành
//                 },
//             };

//             // 5. GỌI API (Create Order)
//             const { data } = await axios.post(
//                 `${this.apiUrl}/orders`, 
//                 orderData, 
//                 config
//             );

//             // 6. Xử lý Thành công
//             setMessage(`Đặt hàng thành công! Mã đơn: ${data._id}`);
            
//             // Xóa sản phẩm khỏi giỏ hàng Frontend (Backend đã tự xóa trong DB)
//             ShoppingCartService.clearCheckoutData();
//             ShoppingCartService.removeCheckoutItemsFromCart();

//             // Chuyển hướng về trang Profile sau 1.5 giây
//             setTimeout(() => {
//                 navigate('/profile');
//             }, 1500);

//         } catch (error) {
//             console.error('Payment error:', error);
//             const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
//             setMessage(errorMsg);
//         } finally {
//             setLoading(false);
//         }
//     }
// }

// // Export instance
// export default new PaymentService();




import axios from 'axios';
import ShoppingCartService from './ShoppingCartService.js';

class PaymentService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
        this.paymentMethods = [
            { id: 'COD', name: 'Thanh toán khi nhận hàng (COD)'},
            { id: 'VNPAY', name: 'Thanh toán qua VNPAY' },
        ];
    }

    getPaymentMethods() {
        return this.paymentMethods;
    }

    getCheckoutData() {
        return ShoppingCartService.getCheckoutData();
    }

    validateCustomerInfo(customerInfo) {
        const errors = {};
        if (!customerInfo.fullName || customerInfo.fullName.trim().length < 2) {
            errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        }
        if (!customerInfo.phone || !/^[0-9]{10,11}$/.test(customerInfo.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }
        if (!customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            errors.email = 'Email không hợp lệ';
        }
        if (!customerInfo.address || customerInfo.address.trim().length < 5) {
            errors.address = 'Vui lòng nhập địa chỉ cụ thể';
        }
        if (!customerInfo.paymentMethod) {
            errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    handleInputChange(formData, setFormData, e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    handleBackToCart(navigate) {
        navigate('/'); 
    }

    async handleSubmit(formData, setErrors, setLoading, setMessage, navigate) {
        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            const validation = this.validateCustomerInfo(formData);
            if (!validation.isValid) {
                setErrors(validation.errors);
                setLoading(false);
                return;
            }

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            if (!token) {
                setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            const checkoutData = this.getCheckoutData();
            if (!checkoutData || !checkoutData.summary) {
                setMessage('Giỏ hàng trống hoặc lỗi dữ liệu');
                setLoading(false);
                return;
            }

            let finalPrice = checkoutData.summary.totalPrice;
            
            const appliedCoupon = localStorage.getItem('appliedCoupon');
            if (appliedCoupon) {
                const couponData = JSON.parse(appliedCoupon);
                const discountPercent = couponData.discount;
                const discountAmount = finalPrice * (discountPercent / 100);
                finalPrice = finalPrice - discountAmount;
                
                console.log(`Đã áp dụng mã giảm giá: -${discountPercent}%`);
            }

            const orderData = {
                orderItems: checkoutData.items.map(item => ({
                    product: item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.qty
                })),
                shippingAddress: {
                    address: formData.address,
                    city: 'Vietnam',
                    postalCode: '100000', 
                    country: 'Vietnam',
                    phone: formData.phone,
                },
                paymentMethod: formData.paymentMethod,
                itemsPrice: checkoutData.summary.totalPrice,
                taxPrice: 0,
                shippingPrice: 0, 
                totalPrice: finalPrice, 
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${this.apiUrl}/orders`, 
                orderData, 
                config
            );

            setMessage(`Đặt hàng thành công! Mã đơn: ${data._id}`);
            
            ShoppingCartService.clearCheckoutData();
            ShoppingCartService.removeCheckoutItemsFromCart();

            localStorage.removeItem('appliedCoupon');

            // Chuyển hướng về trang Profile sau 1.5 giây
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Payment error:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    }
}

export default new PaymentService();