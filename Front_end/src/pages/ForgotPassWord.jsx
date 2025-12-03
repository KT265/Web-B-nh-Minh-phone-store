import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import styles from '../styles/ForgotPassword.module.css';
// import logoImage from '../assets/images/logovector.png';
import forgotPasswordService from '../services/ForgotPasswordService.js';

const ForgotPassWord = () => {
    const [formData, setFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        forgotPasswordService.handleInputChange(formData, setFormData, e);
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
        // Clear message when user starts typing
        if (message) {
            setMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        forgotPasswordService.handleSubmit(formData, setErrors, setLoading, setMessage);
    };

    const handleBackToLogin = () => {
        forgotPasswordService.handleBackToLogin(navigate);
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <Navbar />

            <div className={styles.forgotPasswordForm}>
                <h2>Quên mật khẩu</h2>
                <p className={styles.description}>
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </p>

                <form className={styles.forgotPasswordInput} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}

                    {message && (
                        <div className={`${styles.message} ${message.includes('thất bại') || message.includes('lỗi') ? styles.errorMessage : styles.successMessage}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                    </button>

                    <p className={styles.backToLoginLink}>
                        <button
                            type="button"
                            className={styles.linkButton}
                            onClick={handleBackToLogin}
                            disabled={loading}
                        >
                            ← Quay lại đăng nhập
                        </button>
                    </p>
                </form>

                <img src="/logovector.png" alt="logo" />
            </div>

            <Footer />
        </div>
    );
}

export default ForgotPassWord;