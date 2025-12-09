import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Footer.module.css';


const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFooterClick = (path, label) => {
    switch(label) {
      case 'Trang chủ':
        navigate('/');
        break;
      case 'Giới thiệu':
        navigate('/introduction');
        break;
      case 'Tuyển dụng':
        alert('Hiện chưa có chương trình tuyển dụng nào cho hệ thống cửa hàng!');
        break;
      case 'Chính sách':
        alert('Mua rẻ bán đắt là chính sách của chúng tôi!');
        break;
      case 'Hướng dẫn mua hàng':
        alert('Thêm sản phẩm vào giỏ hàng rồi lựa chọn thanh toán!');
        break;
      case 'Chính sách bảo hành':
        alert('Bảo hành 1 đổi 1 trong vòng 30 ngày');
        break;
      case 'Chính sách đổi trả': 
        alert('Hàng ngon giá tốt cần gì phải đổi trả!');
        break;
      case 'Câu hỏi thường gặp':
        alert('Bạn cần hỗ trợ? Vui lòng liên hệ hotline 0333132230 để được hỗ trợ!');
        break;
      default:
        console.log('Link chưa được xử lý:', label);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <img src="/logovector.png" alt="Logo Bình Minh" 
            onClick={(e) => {e.preventDefault(); handleFooterClick('/', 'Trang chủ');}}
            />
            <h3 
            onClick={(e) => {e.preventDefault(); handleFooterClick('/', 'Trang chủ');}}
            >Bình Minh</h3>
          </div>
          <p>Cửa hàng điện thoại uy tín hàng đầu Việt Nam</p>
        </div>       
        <div className={styles.footerSection}>
          <h4>Về chúng tôi</h4>
          <ul>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/introduction', 'Giới thiệu');}}>Giới thiệu</a></li>
            <li><a href="#">Tin tức</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/tuyen-dung', 'Tuyển dụng');}}
>Tuyển dụng</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/chinh-sach', 'Chính sách');}}>Chính sách</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/huong-dan-mua-hang', 'Hướng dẫn mua hàng');}}>Hướng dẫn mua hàng</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/chinh-sach-bao-hanh', 'Chính sách bảo hành');}}>Chính sách bảo hành</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/chinh-sach-doi-tra', 'Chính sách đổi trả');}}>Chính sách đổi trả</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault(); handleFooterClick('/cau-hoi-thuong-gap', 'Câu hỏi thường gặp');}}>Câu hỏi thường gặp</a></li>
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
            <a href="https://www.instagram.com/kym.tie265/" title="Instagram">Instagram</a>
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