import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Signup.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
// import logoImage from '../assets/images/logovector.png';
import SignupService from '../services/SignupService.js';

const Signup = () => {
  const [formData, setFormData] = useState(SignupService.getInitialFormState());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SignupService.handleInputChange(formData, setFormData, name, value);
    
    // Clear error when user starts typing (after they type at least 1 character)
    if (errors[name] && value.length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Format and validate data
      const formattedData = SignupService.formatFormData(formData);
      
      // Call registration service
      const result = await SignupService.registerUser(formattedData);

      if (result.success) {
        alert(result.message);
        // Navigate to login page after successful registration
        navigate('/login');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        alert(result.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Có lỗi không mong muốn xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.signupPage}>
      <Navbar />
      
      <div className={styles.signupForm}>
        <h2>Đăng ký</h2>
        <form className={styles.signupInput} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              name="username"
              placeholder={errors.username ? errors.username : "Tên đăng nhập"}
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? styles.error : ''}
              title={errors.username || ''}
              required
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>
          
          <div className={styles.inputWrapper}>
            <input 
              type="email" 
              name="email"
              placeholder={errors.email ? errors.email : "Email"}
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? styles.error : ''}
              title={errors.email || ''}
              required
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div className={styles.inputWrapper}>
            <input 
              type="password" 
              name="password"
              placeholder={errors.password ? errors.password : "Mật khẩu"}
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? styles.error : ''}
              title={errors.password || ''}
              required
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
          
          <div className={styles.inputWrapper}>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder={errors.confirmPassword ? errors.confirmPassword : "Xác nhận mật khẩu"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? styles.error : ''}
              title={errors.confirmPassword || ''}
              required
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.signupButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
          
          <p className={styles.loginLink}>
            Đã có tài khoản? 
            <button 
              type="button"
              className={styles.linkButton}
              onClick={handleLoginClick}
            >
              Đăng nhập ngay
            </button>
          </p>
        </form>
        <img src="/logovector.png" alt="logo" />
      </div>    
      <Footer />
    </div>
  );
};

export default Signup;