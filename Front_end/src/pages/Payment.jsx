// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import styles from "../styles/Payment.module.css";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import PaymentService from "../services/PaymentService.js";
// import ShoppingCartService from "../services/ShoppingCartService.js";

// const Payment = () => {
//     const [checkoutData, setCheckoutData] = useState({ items: [], summary: null });
//     const [formData, setFormData] = useState({
//         fullName: '',
//         phone: '',
//         email: '',
//         address: '',
//         paymentMethod: '',
//         discountCode: '',
//         note: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Load checkout data when component mounts
//         const data = PaymentService.getCheckoutData();
//         if (data.items.length === 0) {
//             // Redirect to home if no items to checkout
//             navigate('/');
//         } else {
//             setCheckoutData(data);
//         }
//     }, [navigate]);

//     const handleInputChange = (e) => {
//         PaymentService.handleInputChange(formData, setFormData, e);
//         // Clear error when user starts typing
//         if (errors[e.target.name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [e.target.name]: ''
//             }));
//         }
//         // Clear message when user makes changes
//         if (message) {
//             setMessage('');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         PaymentService.handleSubmit(formData, setErrors, setLoading, setMessage, navigate);
//     };

//     const handleBackToCart = () => {
//         PaymentService.handleBackToCart(navigate);
//     };

//     return (
//         <div className={styles.bodyPayment}>
//             <div className={styles.navbarContainer}>
//                 <Navbar />
//             </div>
            
//             <div className={styles.mainContent}>
//                 <div className={styles.paymentContainer}>
//                     <h2>Thanh toán đơn hàng</h2>
                    
//                     {/* Order Summary */}
//                     <div className={styles.orderSummary}>
//                         <h3>Đơn hàng của bạn</h3>
//                         <div className={styles.itemsList}>
//                             {checkoutData.items.map((item) => (
//                                 <div key={item.id} className={styles.orderItem}>
//                                     <div className={styles.itemInfo}>
//                                         <span className={styles.itemName}>{item.name}</span>
//                                         <span className={styles.itemQuantity}>x{item.quantity}</span>
//                                     </div>
//                                     <span className={styles.itemPrice}>
//                                         {ShoppingCartService.formatPrice(item.currentPrice || item.price)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
                        
//                         {checkoutData.summary && (
//                             <div className={styles.totalSection}>
//                                 <div className={styles.totalRow}>
//                                     <span>Tổng số lượng:</span>
//                                     <span>{checkoutData.summary.totalItems} sản phẩm</span>
//                                 </div>
//                                 <div className={styles.totalRow}>
//                                     <strong>Tổng tiền:</strong>
//                                     <strong className={styles.totalPrice}>
//                                         {ShoppingCartService.formatPrice(checkoutData.summary.totalPrice)}
//                                     </strong>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Customer Information Form */}
//                     <div className={styles.customerForm}>
//                         <h3>Thông tin giao hàng</h3>
//                         <form onSubmit={handleSubmit}>
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="fullName">Họ và tên *</label>
//                                 <input
//                                     type="text"
//                                     id="fullName"
//                                     name="fullName"
//                                     value={formData.fullName}
//                                     onChange={handleInputChange}
//                                     disabled={loading}
//                                     required
//                                 />
//                                 {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
//                             </div>

//                             <div className={styles.formRow}>
//                                 <div className={styles.formGroup}>
//                                     <label htmlFor="phone">Số điện thoại *</label>
//                                     <input
//                                         type="tel"
//                                         id="phone"
//                                         name="phone"
//                                         value={formData.phone}
//                                         onChange={handleInputChange}
//                                         disabled={loading}
//                                         required
//                                     />
//                                     {errors.phone && <span className={styles.error}>{errors.phone}</span>}
//                                 </div>

//                                 <div className={styles.formGroup}>
//                                     <label htmlFor="email">Email *</label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         disabled={loading}
//                                         required
//                                     />
//                                     {errors.email && <span className={styles.error}>{errors.email}</span>}
//                                 </div>
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label htmlFor="address">Địa chỉ giao hàng *</label>
//                                 <textarea
//                                     id="address"
//                                     name="address"
//                                     value={formData.address}
//                                     onChange={handleInputChange}
//                                     disabled={loading}
//                                     rows="3"
//                                     required
//                                 />
//                                 {errors.address && <span className={styles.error}>{errors.address}</span>}
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <label htmlFor="paymentMethod">Phương thức thanh toán *</label>
//                                 <select
//                                     id="paymentMethod"
//                                     name="paymentMethod"
//                                     value={formData.paymentMethod}
//                                     onChange={handleInputChange}
//                                     disabled={loading}
//                                     required
//                                 >
//                                     <option value="">Chọn phương thức thanh toán</option>
//                                     {PaymentService.getPaymentMethods().map((method) => (
//                                         <option key={method.id} value={method.id}>
//                                             {method.icon} {method.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {errors.paymentMethod && <span className={styles.error}>{errors.paymentMethod}</span>}
//                             </div>

//                             <div className={styles.formGroup}>
//                                 <input 
//                                     type="text"
//                                     id="Discounts"
//                                     name="discountCode"
//                                     value={formData.discountCode}
//                                     onChange={handleInputChange}
//                                     disabled={loading}
//                                     placeholder="Mã giảm giá (nếu có)"
//                                 />                       
//                             </div>
                            
//                             <div className={styles.formGroup}>
//                                 <label htmlFor="note">Ghi chú (tùy chọn)</label>
//                                 <textarea
//                                     id="note"
//                                     name="note"
//                                     value={formData.note}
//                                     onChange={handleInputChange}
//                                     disabled={loading}
//                                     rows="2"
//                                     placeholder="Ghi chú thêm cho đơn hàng..."
//                                 />
//                             </div>

//                             {message && (
//                                 <div className={`${styles.message} ${message.includes('thành công') ? styles.successMessage : styles.errorMessage}`}>
//                                     {message}
//                                 </div>
//                             )}

//                             <div className={styles.buttonGroup}>
//                                 <button
//                                     type="button"
//                                     className={styles.backButton}
//                                     onClick={handleBackToCart}
//                                     disabled={loading}
//                                 >
//                                     ← Quay lại giỏ hàng
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className={styles.submitButton}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
            
//             {/* <div className={styles.footerContainer}>
//                 <Footer/>
//             </div> */}
//         </div>
//     );
// };

// export default Payment;





import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "../styles/Payment.module.css";
import Navbar from "../components/Navbar.jsx";
import PaymentService from "../services/PaymentService.js";
import ShoppingCartService from "../services/ShoppingCartService.js";

const Payment = () => {
    const [checkoutData, setCheckoutData] = useState({ items: [], summary: null });
    
    // --- STATE MỚI CHO GIẢM GIÁ ---
    const [discountInfo, setDiscountInfo] = useState({ percent: 0, code: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: '',
        discountCode: '',
        note: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Load checkout data
        const data = PaymentService.getCheckoutData();
        if (data.items.length === 0) {
            navigate('/');
        } else {
            setCheckoutData(data);
        }

        // 2. CHECK LOCAL STORAGE ĐỂ LẤY MÃ GIẢM GIÁ TỪ GIỎ HÀNG
        const appliedCoupon = localStorage.getItem('appliedCoupon');
        if (appliedCoupon) {
            const couponData = JSON.parse(appliedCoupon);
            
            // Lưu thông tin giảm giá vào state
            setDiscountInfo({
                percent: couponData.discount,
                code: couponData.code
            });

            // Tự động điền mã vào formData để gửi về backend khi submit
            setFormData(prev => ({
                ...prev,
                discountCode: couponData.code
            }));
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        PaymentService.handleInputChange(formData, setFormData, e);
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
        if (message) setMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lưu ý: Bạn cần đảm bảo PaymentService xử lý được việc gửi discountCode về Backend
        PaymentService.handleSubmit(formData, setErrors, setLoading, setMessage, navigate);
        
        // Sau khi đặt hàng thành công, nên xóa coupon khỏi localStorage
        // localStorage.removeItem('appliedCoupon'); 
    };

    const handleBackToCart = () => {
        PaymentService.handleBackToCart(navigate);
    };

    // --- TÍNH TOÁN TIỀN ---
    const subtotal = checkoutData.summary ? checkoutData.summary.totalPrice : 0;
    const discountAmount = subtotal * (discountInfo.percent / 100);
    const finalTotal = subtotal - discountAmount;

    return (
        <div className={styles.bodyPayment}>
            <div className={styles.navbarContainer}>
                <Navbar />
            </div>
            
            <div className={styles.mainContent}>
                <div className={styles.paymentContainer}>
                    <h2>Thanh toán đơn hàng</h2>
                    
                    {/* Order Summary */}
                    <div className={styles.orderSummary}>
                        <h3>Đơn hàng của bạn</h3>
                        <div className={styles.itemsList}>
                            {checkoutData.items.map((item) => (
                                <div key={item.id} className={styles.orderItem}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                                    </div>
                                    <span className={styles.itemPrice}>
                                        {ShoppingCartService.formatPrice(item.currentPrice || item.price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {checkoutData.summary && (
                            <div className={styles.totalSection}>
                                <div className={styles.totalRow}>
                                    <span>Tổng số lượng:</span>
                                    <span>{checkoutData.summary.totalItems} sản phẩm</span>
                                </div>
                                
                                {/* HIỂN THỊ CHI TIẾT GIÁ */}
                                <div className={styles.totalRow}>
                                    <span>Tạm tính:</span>
                                    <span>{ShoppingCartService.formatPrice(subtotal)}</span>
                                </div>

                                {discountInfo.percent > 0 && (
                                    <div className={styles.totalRow} style={{color: 'green'}}>
                                        <span>Giảm giá ({discountInfo.percent}%):</span>
                                        <span>- {ShoppingCartService.formatPrice(discountAmount)}</span>
                                    </div>
                                )}

                                <div className={styles.totalRow} style={{borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px'}}>
                                    <strong>Tổng tiền:</strong>
                                    <strong className={styles.totalPrice} style={{color: '#d32f2f', fontSize: '1.2rem'}}>
                                        {ShoppingCartService.formatPrice(finalTotal)}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Customer Information Form */}
                    <div className={styles.customerForm}>
                        <h3>Thông tin giao hàng</h3>
                        <form onSubmit={handleSubmit}>
                            {/* ... Các trường Name, Phone, Email, Address giữ nguyên ... */}
                            <div className={styles.formGroup}>
                                <label htmlFor="fullName">Họ và tên *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        required
                                    />
                                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        required
                                    />
                                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="address">Địa chỉ giao hàng *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    rows="3"
                                    required
                                />
                                {errors.address && <span className={styles.error}>{errors.address}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="paymentMethod">Phương thức thanh toán *</label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">Chọn phương thức thanh toán</option>
                                    {PaymentService.getPaymentMethods().map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.icon} {method.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.paymentMethod && <span className={styles.error}>{errors.paymentMethod}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Mã giảm giá</label>
                                <input 
                                    type="text"
                                    id="Discounts"
                                    name="discountCode"
                                    value={formData.discountCode}
                                    onChange={handleInputChange}
                                    disabled={loading || discountInfo.code !== ''} // Khóa ô này nếu đã áp dụng mã từ Cart
                                    placeholder="Mã giảm giá"
                                    style={discountInfo.code ? {backgroundColor: '#e8f0fe', borderColor: '#4285f4'} : {}}
                                />     
                                {discountInfo.code && <small style={{color: 'green'}}>Đã áp dụng mã: {discountInfo.code}</small>}                  
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="note">Ghi chú (tùy chọn)</label>
                                <textarea
                                    id="note"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    rows="2"
                                    placeholder="Ghi chú thêm cho đơn hàng..."
                                />
                            </div>

                            {message && (
                                <div className={`${styles.message} ${message.includes('thành công') ? styles.successMessage : styles.errorMessage}`}>
                                    {message}
                                </div>
                            )}

                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    className={styles.backButton}
                                    onClick={handleBackToCart}
                                    disabled={loading}
                                >
                                    ← Quay lại giỏ hàng
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : `Thanh toán ${ShoppingCartService.formatPrice(finalTotal)}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;