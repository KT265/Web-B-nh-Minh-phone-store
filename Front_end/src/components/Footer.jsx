import React from 'react';
import styles from '../styles/Footer.module.css';
// import logoImage from '../assets/images/logovector.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <img src="/logovector.png" alt="Logo Bình Minh" />
            <h3>Bình Minh</h3>
          </div>
          <p>Cửa hàng điện thoại uy tín hàng đầu Việt Nam</p>
        </div>       
        <div className={styles.footerSection}>
          <h4>Về chúng tôi</h4>
          <ul>
            <li><a href="#">Giới thiệu </a></li>
            <li><a href="#">Tin tức</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Chính sách</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Liên hệ</h4>
          <ul>
            <li>📧 Email: BinhMinhstore@gmail.com</li>
            <li>📞 Hotline: 0333132230</li>
            <li>📍 <strong>HN:</strong> 3/27/350 Kim Giang-Hoàng Mai</li>
          </ul>
          <div className={styles.socialLinks}>
            <a href="https://www.facebook.com/Kym.Tie265" title="Facebook">Facebook</a>
            <a href="#" title="Instagram">Instagram</a>
            <a href="https://www.youtube.com/@DEMONEDM2005#" title="YouTube">YouTube</a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; 2025 Bình Minh. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;