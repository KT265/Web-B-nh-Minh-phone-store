// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import styles from '../styles/Navbar.module.css';
// import logoImage from '../assets/images/logovector.png';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleSignup = () => {
//     navigate('/signup');
//   };

//   const handleNavClick = (path, label) => {
//     switch(label) {
//       case 'Trang chủ':
//         navigate('/');
//         break;
//       case 'Sản phẩm':
//         alert('Trang sản phẩm đang được phát triển!');
//         break;
//       case 'Giới thiệu':
//         alert('Trang giới thiệu đang được phát triển!');
//         break;
//       case 'Tin Tức':
//         alert('Trang tin tức đang được phát triển!');
//         break;
//       case 'Liên hệ':
//         alert('Trang liên hệ đang được phát triển!');
//         break;
//       default:
//         console.log('Link chưa được xử lý:', label);
//     }
//   };

//   const isActive = (path) => {
//     if (path === '/' && location.pathname === '/') return true;
//     if (path !== '/' && location.pathname.startsWith(path)) return true;
//     return false;
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.brand}>
//         <img className={styles.logoBrand} src={logoImage} alt="Logo" />
//         <span className={styles.brandName}>Bình Minh</span>
//       </div>
//       <div className={styles.navLinks}>
//         <a 
//           href="#" 
//           className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
//           onClick={(e) => {e.preventDefault(); handleNavClick('/', 'Trang chủ');}}
//         >
//           Trang chủ
//         </a>
//         <a 
//           href="#" 
//           className={styles.navLink}
//           onClick={(e) => {e.preventDefault(); handleNavClick('/products', 'Sản phẩm');}}
//         >
//           Sản phẩm
//         </a>
//         <a 
//           href="#" 
//           className={styles.navLink}
//           onClick={(e) => {e.preventDefault(); handleNavClick('/about', 'Giới thiệu');}}
//         >
//           Giới thiệu
//         </a>
//         <a 
//           href="#" 
//           className={styles.navLink}
//           onClick={(e) => {e.preventDefault(); handleNavClick('/news', 'Tin Tức');}}
//         >
//           Tin Tức
//         </a>
//         <a 
//           href="#" 
//           className={styles.navLink}
//           onClick={(e) => {e.preventDefault(); handleNavClick('/contact', 'Liên hệ');}}
//         >
//           Liên hệ 
//         </a>
//       </div>
//       <div className={styles.accounts}>
//         <button className={styles.accountsButton} onClick={handleLogin}>
//           &#128273; Login
//         </button>
//         <button className={styles.accountsButton} onClick={handleSignup}>
//           🚀 Sign Up
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState, useEffect , useRef} from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
// import logoImage from '../assets/images/logovector.png';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const newsDropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  
  // 1. Thêm state để lưu thông tin người dùng
  const [userInfo, setUserInfo] = useState(null);

  // 2. Dùng useEffect để kiểm tra localStorage khi Navbar hiện lên
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);
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
  // 3. Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Xóa token
    setUserInfo(null); // Xóa state
    setIsContactDropdownOpen(false);
    navigate('/login'); // Chuyển về trang đăng nhập
  };

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
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAdmin = userInfo?.isAdmin || userInfo?.user?.isAdmin;

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
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand} onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <img className={styles.logoBrand} src="/logovector.png" alt="Logo" 
        onClick={(e)=>{e.preventDefault(); handleNavClick('/', 'Trang chủ');}} />
        <span className={styles.brandName} onClick={(e)=>{e.preventDefault(); handleNavClick('/', 'Trang chủ');}}>Bình Minh</span>
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
          onClick={(e) => {e.preventDefault(); handleNavClick('/about', 'Giới thiệu');}}
        >
          Giới thiệu
        </a>
        {/* <a 
          href="#" 
          className={styles.navLink}
          onClick={(e) => {e.preventDefault(); handleNavClick('/news', 'Tin Tức');}}
        >
          Tin Tức
        </a>
        <a 
          href="#" 
          className={styles.navLink}
          onClick={(e) => {e.preventDefault(); handleNavClick('/contact', 'Liên hệ');}}
        >
          Liên hệ 
        </a> */}
        <div className={styles.contactDropdown} ref={newsDropdownRef}>
          <button 
            className={styles.navLink}
            onClick={toggleNewsDropdown}
            aria-expanded={isNewsDropdownOpen}
            style={{border : 'none', background: 'none', fontFamily: 'Inter', fontSize: '16px'}}
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
            style={{background: 'none', border: 'none', fontFamily: 'Inter', fontSize: '16px'}}
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
        {userInfo ? (
          // === GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ===
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            <Link 
              to={isAdmin ? "/admin" : "/profile"} 
              style={{ textDecoration: 'none', color: '#5b9094', fontWeight: 'bold' }}
            >
              {userInfo.user?.name || userInfo.name || 'Khách hàng'}
              {''}
            </Link>
            
            <button 
                className={styles.accountsButton} 
                onClick={handleLogout}
                style={{ fontSize: '14px', padding: '8px 12px' }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          // === GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (KHÁCH) ===
          <>
            <button className={styles.accountsButton} onClick={handleLogin}>
              &#128273; Login
            </button>
            <button className={styles.accountsButton} onClick={handleSignup}>
              🚀 Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;