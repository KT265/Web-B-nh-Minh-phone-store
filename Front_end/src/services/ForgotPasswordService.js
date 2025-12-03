class ForgotPasswordService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors = {};

        if (!email) {
            errors.email = 'Email không được để trống';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Email không đúng định dạng';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Handle forgot password request
    async requestPasswordReset(email) {
        try {
            const validationResult = this.validateEmail(email);

            if (!validationResult.isValid) {
                return {
                    success: false,
                    errors: validationResult.errors
                };
            }

            // TODO: Replace with actual API call when backend is ready
            console.log('Password reset request for:', email);

            // Simulate API call
            await this.simulateApiCall();

            // For now, return success (replace with actual API logic)
            return {
                success: true,
                message: 'Đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.'
            };

        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra trong quá trình gửi email. Vui lòng thử lại.'
            };
        }
    }

    // Simulate API call delay
    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 2000));
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
    async handleSubmit(formData, setErrors, setLoading, setMessage) {
        try {
            setLoading(true);
            setErrors({});
            setMessage('');

            const result = await this.requestPasswordReset(formData.email);

            if (result.success) {
                setMessage(result.message);
                // Clear the form after successful submission
                // setFormData({ email: '' });
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setMessage(result.message || 'Gửi yêu cầu thất bại');
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    // Handle back to login navigation
    handleBackToLogin(navigate) {
        navigate('/login');
    }
}

// Export singleton instance
const forgotPasswordService = new ForgotPasswordService();
export default forgotPasswordService;