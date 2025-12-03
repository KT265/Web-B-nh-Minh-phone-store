// class LoginService {
//   constructor() {
//     this.apiUrl = 'http://localhost:5000/api';
//   }

//   // Validate login form data
//   validateLoginData(formData) {
//     const errors = {};
//     if (!formData.username) {
//       errors.username = 'Tên đăng nhập hoặc email không được để trống';
//     } else if (formData.username.length < 3) {
//       errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
//     }
//     if (!formData.password) {
//       errors.password = 'Mật khẩu không được để trống';
//     } else if (formData.password.length < 6) {
//       errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
//     }

//     return {
//       isValid: Object.keys(errors).length === 0,
//       errors
//     };
//   }

//   // Format form data for API request
//   formatLoginData(formData) {
//     return {
//       username: formData.username.trim(),
//       password: formData.password
//     };
//   }

//   // Handle login API request
//   async loginUser(formData) {
//     try {
//       const validationResult = this.validateLoginData(formData);

//       if (!validationResult.isValid) {
//         return {
//           success: false,
//           errors: validationResult.errors
//         };
//       }

//       const loginData = this.formatLoginData(formData);

//       // TODO: Replace with actual API call when backend is ready
//       console.log('Login attempt:', loginData);

//       // Simulate API call
//       await this.simulateApiCall();

//       // For now, return success (replace with actual API logic)
//       return {
//         success: true,
//         message: 'Đăng nhập thành công!',
//         user: {
//           id: 1,
//           username: loginData.username,
//           email: loginData.username.includes('@') ? loginData.username : `${loginData.username}@example.com`
//         }
//       };

//     } catch (error) {
//       console.error('Login error:', error);
//       return {
//         success: false,
//         message: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
//       };
//     }
//   }

//   // Simulate API call delay
//   async simulateApiCall() {
//     return new Promise(resolve => setTimeout(resolve, 1000));
//   }

//   // Check if user is logged in
//   isLoggedIn() {
//     return localStorage.getItem('user') !== null;
//   }

//   // Get current user from localStorage
//   getCurrentUser() {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }

//   // Save user to localStorage
//   saveUser(user) {
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   // Logout user
//   logout() {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   }

//   // Handle form input changes
//   handleInputChange(formData, setFormData, e) {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   // Handle form submission
//   async handleSubmit(formData, setErrors, setLoading, navigate) {
//     try {
//       setLoading(true);
//       setErrors({});

//       const result = await this.loginUser(formData);

//       if (result.success) {
//         // Save user data
//         this.saveUser(result.user);

//         // Navigate to home page or dashboard
//         alert(result.message);
//         navigate('/');
//       } else {
//         if (result.errors) {
//           setErrors(result.errors);
//         } else {
//           alert(result.message || 'Đăng nhập thất bại');
//         }
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       alert('Có lỗi xảy ra. Vui lòng thử lại.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Handle signup navigation
//   handleSignupClick(navigate) {
//     navigate('/signup');
//   }

//   // Handle forgot password navigation
//   handleForgotPasswordClick(navigate) {
//     navigate('/forgot-password');
//   }
// }

// // Export singleton instance
// const loginService = new LoginService();
// export default loginService;




import axios from 'axios';

class LoginService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/api';
  }

  // Xử lý thay đổi input
  handleInputChange(formData, setFormData, e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Xử lý chuyển trang đăng ký
  handleSignupClick(navigate) {
    navigate('/signup');
  }

  // Xử lý quên mật khẩu
  handleForgotPasswordClick(navigate) {
    alert("Chức năng đang phát triển");
  }

  // Xử lý Submit Form Đăng nhập
  async handleSubmit(formData, setErrors, setLoading, navigate) {
    setLoading(true);
    setErrors({});

    try {
      // 1. Kiểm tra dữ liệu đầu vào cơ bản
      if (!formData.username || !formData.password) {
        setErrors({
          username: !formData.username ? 'Vui lòng nhập email' : '',
          password: !formData.password ? 'Vui lòng nhập mật khẩu' : ''
        });
        setLoading(false);
        return;
      }

      // 2. Gọi API Backend (Bạn Đức)
      // Lưu ý: Backend đang mong đợi field là 'email', nhưng form bạn đặt là 'username'
      // Nên ta gán username của form vào field email của API
      const apiData = {
        email: formData.username, 
        password: formData.password
      };

      const response = await axios.post(`${this.apiUrl}/customer/login`, apiData);

      // 3. Xử lý khi thành công
      if (response.status === 200) {
        // Lưu thông tin user và token vào localStorage
        // Key là 'userInfo' để thống nhất với Navbar
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        
        alert('Đăng nhập thành công!');

        // 👇 QUAN TRỌNG: Dùng cái này thay vì navigate('/') để Navbar tự cập nhật
        window.location.href = '/'; 
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Xử lý hiển thị lỗi từ Backend trả về
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401 || status === 400) {
          setErrors({
            password: data.message || 'Email hoặc mật khẩu không chính xác' // Hiển thị lỗi chung ở dòng password cho gọn
          });
        } else {
          alert(data.message || 'Có lỗi xảy ra');
        }
      } else {
        alert('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  }
}

// Export singleton instance
const loginService = new LoginService();
export default loginService;