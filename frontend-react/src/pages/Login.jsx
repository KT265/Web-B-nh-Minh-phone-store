import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import logoImage from '../assets/images/logovector.png';
import loginService from '../services/LoginService.js';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    loginService.handleInputChange(formData, setFormData, e);
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginService.handleSubmit(formData, setErrors, setLoading, navigate);
  };

  const handleSignupClick = () => {
    loginService.handleSignupClick(navigate);
  };

  const handleForgotPasswordClick = () => {
    loginService.handleForgotPasswordClick(navigate);
  }

  return (
    <div className={styles.loginPage}>
      <Navbar />

      <div className={styles.loginForm}>
        <h2>Đăng nhập</h2>
        <form className={styles.loginInput} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập hoặc email"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className={styles.signupLink}>
            Chưa có tài khoản?
            <button
              type="button"
              className={styles.linkButton}
              onClick={handleSignupClick}
              disabled={loading}
            >
              Đăng ký ngay
            </button>
          </p>
          <p className={styles.forgotPasswordLink}>
            <button
              type="button"
              className={styles.forgotPasswordButton}
              onClick={handleForgotPasswordClick}
              disabled={loading}
            >
              Quên mật khẩu?
            </button>
          </p>
        </form>
        <img src={logoImage} alt="logo" />
      </div>

      <Footer />
    </div>
  );
};

export default Login;