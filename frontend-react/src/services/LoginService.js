class LoginService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/api';
  }

  // Validate login form data
  validateLoginData(formData) {
    const errors = {};
    if (!formData.username) {
      errors.username = 'Tên đăng nhập hoặc email không được để trống';
    } else if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format form data for API request
  formatLoginData(formData) {
    return {
      username: formData.username.trim(),
      password: formData.password
    };
  }

  // Handle login API request
  async loginUser(formData) {
    try {
      const validationResult = this.validateLoginData(formData);

      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        };
      }

      const loginData = this.formatLoginData(formData);

      // TODO: Replace with actual API call when backend is ready
      console.log('Login attempt:', loginData);

      // Simulate API call
      await this.simulateApiCall();

      // For now, return success (replace with actual API logic)
      return {
        success: true,
        message: 'Đăng nhập thành công!',
        user: {
          id: 1,
          username: loginData.username,
          email: loginData.username.includes('@') ? loginData.username : `${loginData.username}@example.com`
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
      };
    }
  }

  // Simulate API call delay
  async simulateApiCall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Save user to localStorage
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('userLoggedIn'))
  }

  // Logout user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLoggedOut'));
  }

  // Handle form input changes
  handleInputChange(formData, setFormData, e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Handle form submission
  async handleSubmit(formData, setErrors, setLoading, navigate) {
    try {
      setLoading(true);
      setErrors({});

      const result = await this.loginUser(formData);

      if (result.success) {
        // Save user data
        this.saveUser(result.user);

        // Navigate to home page or dashboard
        alert(result.message);
        navigate('/');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  // Handle signup navigation
  handleSignupClick(navigate) {
    navigate('/signup');
  }

  // Handle forgot password navigation
  handleForgotPasswordClick(navigate) {
    navigate('/forgot-password');
  }
}

// Export singleton instance
const loginService = new LoginService();
export default loginService;