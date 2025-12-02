import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductList from '../pages/ProductList';
import Introduction from '../pages/Introduction';
import styles from '../styles/Navbar.module.css';
import logoImage from '../assets/images/logovector.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const newsDropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

    useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', checkLoginStatus);
    
    // Listen for custom login event
    window.addEventListener('userLoggedIn', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLoggedIn', checkLoginStatus);
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleNavClick = (path, label) => {
    switch(label) {
      case 'Trang chủ':
        navigate('/');
        break;
      case 'Sản phẩm':
        navigate('/productlist');
        break;
      case 'Giới thiệu':
        navigate('/introduction');
        break;
      default:
        console.log('Link chưa được xử lý:', label);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleUserOption = (option) => {
    switch(option) {
      case 'login':
        navigate('/login');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'logout':
        // Xử lý đăng xuất ở đây (clear localStorage, etc.)
        localStorage.clear();
        navigate('/');
        break;
      default:
        console.log('Option chưa được xử lý:', option);
    }
    setIsUserDropdownOpen(false);
  };

  const userOptions = isLoggedIn 
      ? [
          { label: '📦 Đơn hàng', action: 'orders' },
          { label: 'Đăng xuất', action: 'logout' }
        ]
      : [
          { label: '🔑 Đăng nhập', action: 'login' },
          { label: '📦 Đơn hàng', action: 'orders' },
          { label: 'Đăng xuất', action: 'logout' }
        ];

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNewsDropdownOpen(false); // Đóng các dropdown khác
    setIsContactDropdownOpen(false);
  };
  
  const toggleNewsDropdown = () => {
    setIsNewsDropdownOpen(!isNewsDropdownOpen);
    setIsContactDropdownOpen(false); // Đóng dropdown kia nếu đang mở
    setIsUserDropdownOpen(false); // Đóng user dropdown
  };

  const toggleContactDropdown = () => {
    setIsContactDropdownOpen(!isContactDropdownOpen);
    setIsNewsDropdownOpen(false); // Đóng dropdown kia nếu đang mở
    setIsUserDropdownOpen(false); // Đóng user dropdown
  };

  const handleNewsOption = (url, external = false) => {
    if (external) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else {
      navigate(url);
    }
    setIsNewsDropdownOpen(false);
  };

  const handleContactOption = (url, external = false) => {
    if (external) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else {
      navigate(url);
    }
    setIsContactDropdownOpen(false);
  };
  
  const newsOptions = [
    { 
      url: 'https://vnexpress.net/khoa-hoc-cong-nghe', 
      alt: 'VnExpress icon',
      external: true,
      icon: 'https://s1.vnecdn.net/vnexpress/restruct/i/v9508/v2_2019/pc/graphics/logo.svg'
    },
    { 
      url: 'https://voz.vn/', 
      alt: 'Voz icon',
      external: true,
      icon: 'https://th.bing.com/th/id/R.8b6166c458368cc598ec76003b16cf39?rik=vjHTz%2f4HSurdHw&pid=ImgRaw&r=0'
    },
    { 
      url: 'https://www.reddit.com/', 
      alt: 'Reddit icon',
      external: true,
      icon: 'https://logos-world.net/wp-content/uploads/2023/12/Reddit-Logo.jpg'
    },
  ];
  const contactOptions = [
    { icon: 'https://tse4.mm.bing.net/th/id/OIP.QHODby_bS81-x2of8vCIhgHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', 
      url: 'https://www.facebook.com/Kym.Tie265',
      alt: 'Facebook icon',
      external: true
    },
    { icon:'https://tse2.mm.bing.net/th/id/OIP.q1kFk5fqe5hGx3rH_iD_9QHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
      url: 'https://zalo.me/0333132230',
      alt: 'Zalo icon',
      external: true },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newsDropdownRef.current && !newsDropdownRef.current.contains(event.target)) {
        setIsNewsDropdownOpen(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setIsContactDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img 
        className={styles.logoBrand} src={logoImage} alt="Logo" 
        onClick={(e) => {e.preventDefault(); handleNavClick('/', 'Trang chủ');}}
        />
        <span 
        className={styles.brandName}
        onClick={(e) => {e.preventDefault(); handleNavClick('/', 'Trang chủ');}}
        >
          Bình Minh
        </span>
      </div>
      <div className={styles.navLinks}>
        <a 
          href="#" 
          className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          onClick={(e) => {e.preventDefault(); handleNavClick('/', 'Trang chủ');}}
        >
          Trang chủ
        </a>
        <a 
          href="#" 
          className={styles.navLink}
          onClick={(e) => {e.preventDefault(); handleNavClick('/products', 'Sản phẩm');}}
        >
          Sản phẩm
        </a>
        <a 
          href="#" 
          className={styles.navLink}
          onClick={(e) => {e.preventDefault(); handleNavClick('/introduction', 'Giới thiệu');}}
        >
          Giới thiệu
        </a>
        <div className={styles.contactDropdown} ref={newsDropdownRef}>
          <button 
            className={styles.navLink}
            onClick={toggleNewsDropdown}
            aria-expanded={isNewsDropdownOpen}
          >
            Tin Tức {isNewsDropdownOpen ? '▲' : '▼'}
          </button>
          {isNewsDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {newsOptions.map((option, index) => (
                <button
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleNewsOption(option.url, option.external)}
                >
                  <img src={option.icon} alt={`${option.alt} icon`} className={styles.dropdownIcon} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.contactDropdown} ref={contactDropdownRef}>
          <button 
            className={styles.navLink}
            onClick={toggleContactDropdown}
            aria-expanded={isContactDropdownOpen}
          >
            Liên hệ {isContactDropdownOpen ? '▲' : '▼'}
          </button>
          {isContactDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {contactOptions.map((option, index) => (
                <button
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleContactOption(option.url, option.external)}
                >
                  <img src={option.icon} alt={`${option.alt} icon`} className={styles.dropdownIcon} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.accounts}>
        <div className={styles.userDropdown} ref={userDropdownRef}>
          <button 
            className={styles.userButton}
            onClick={toggleUserDropdown}
            aria-expanded={isUserDropdownOpen}
          >
            👤 User
          </button>
          {isUserDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {userOptions.map((option, index) => (
                <button
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleUserOption(option.action)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;