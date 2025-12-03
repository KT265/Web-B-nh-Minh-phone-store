import axios from 'axios';

class SignupService {
  // Base URL for API
  static baseURL = 'http://localhost:5000/api';

  /**
   * Validate form data
   */
  static validateSignupData(formData) {
    const errors = {};
    if (!formData.username || formData.username.trim().length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check if username already exists
   */
  static async checkUsernameExists(username) {
    try {
      const response = await axios.get(`${this.baseURL}/auth/check-username`, {
        params: { username }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  }

  /**
   * Check if email already exists
   */
  static async checkEmailExists(email) {
    try {
      const response = await axios.get(`${this.baseURL}/auth/check-email`, {
        params: { email }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  /**
   * Register new user
   */
  // static async registerUser(userData) {
  //   try {
  //     // Validate data first
  //     const validation = this.validateSignupData(userData);
  //     if (!validation.isValid) {
  //       return {
  //         success: false,
  //         errors: validation.errors
  //       };
  //     }

  //     // Prepare data for API
  //     const apiData = {
  //       username: userData.username.trim(),
  //       email: userData.email.trim().toLowerCase(),
  //       password: userData.password
  //     };

  //     // Call registration API
  //     const response = await axios.post(`${this.baseURL}/auth/register`, apiData);

  //     if (response.status === 201) {
  //       return {
  //         success: true,
  //         message: 'Đăng ký thành công!',
  //         user: response.data.user
  //       };
  //     }

  //     return {
  //       success: false,
  //       message: 'Có lỗi xảy ra khi đăng ký'
  //     };

  //   } catch (error) {
  //     console.error('Registration error:', error);

  //     if (error.response) {
  //       // Server responded with error
  //       const { status, data } = error.response;
        
  //       if (status === 400) {
  //         return {
  //           success: false,
  //           message: data.message || 'Dữ liệu không hợp lệ',
  //           errors: data.errors || {}
  //         };
  //       } else if (status === 409) {
  //         return {
  //           success: false,
  //           message: 'Tên đăng nhập hoặc email đã tồn tại'
  //         };
  //       }
  //     }

  //     return {
  //       success: false,
  //       message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
  //     };
  //   }
  // }

/**
   * Register new user
   */
  static async registerUser(userData) {
    try {
      // 1. Validate data first
      const validation = this.validateSignupData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // 2. Prepare data for API (Sửa 'username' thành 'name')
      //    (Backend của bạn Đức đang nhận 'name', không phải 'username')
      const apiData = {
        name: userData.username.trim(), // Đổi 'username' thành 'name'
        email: userData.email.trim().toLowerCase(),
        password: userData.password
      };

      // 3. Call registration API (Sửa URL)
      //    Thay vì '/auth/register', chúng ta gọi '/customer'
      const response = await axios.post(`${this.baseURL}/customer`, apiData);

      if (response.status === 201) {
        // 4. Tự động đăng nhập bằng cách lưu token
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        
        return {
          success: true,
          message: 'Đăng ký thành công!',
          user: response.data
        };
      }

      return {
        success: false,
        message: 'Có lỗi xảy ra khi đăng ký'
      };

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server báo lỗi (ví dụ: email đã tồn tại)
        return {
          success: false,
          message: error.response.data.message || 'Lỗi từ server'
        };
      }
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
      };
    }
  }


  /**
   * Send email verification
   */
  static async sendEmailVerification(email) {
    try {
      await axios.post(`${this.baseURL}/auth/send-verification`, {
        email
      });
      return {
        success: true,
        message: 'Email xác thực đã được gửi'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Không thể gửi email xác thực'
      };
    }
  }

  /**
   * Format form data
   */
  static formatFormData(formData) {
    return {
      username: formData.username?.trim() || '',
      email: formData.email?.trim().toLowerCase() || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || ''
    };
  }

  /**
   * Get initial form state
   */
  static getInitialFormState() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  /**
   * Handle form input change
   */
  static handleInputChange(formData, setFormData, name, value) {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
}

export default SignupService;