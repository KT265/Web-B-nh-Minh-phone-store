import Coupon from '../models/couponModel.js';

// @desc    Lấy danh sách mã giảm giá
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo mã giảm giá mới
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    res.status(400);
    throw new Error('Mã giảm giá này đã tồn tại');
  }

  const coupon = await Coupon.create({
    code,
    discount,
    expirationDate
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error('Dữ liệu không hợp lệ');
  }
};

// @desc    Xóa mã giảm giá
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Đã xóa mã giảm giá' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy mã');
  }
};

// @desc    Kiểm tra mã giảm giá (Cho khách hàng)
// @route   POST /api/coupons/validate
// @access  Private (Khách hàng đã đăng nhập)
const validateCoupon = async (req, res) => {
  const { code } = req.body;
  // Tìm mã trong database
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (coupon) {
    // Kiểm tra hạn sử dụng
    if (new Date() > coupon.expirationDate) {
        res.status(400);
        throw new Error('Mã giảm giá đã hết hạn');
    }
    // Trả về số phần trăm giảm giá
    res.json({
        discount: coupon.discount,
        code: coupon.code,
        message: 'Áp dụng mã thành công!'
    });
  } else {
    res.status(404);
    throw new Error('Mã giảm giá không tồn tại');
  }
};

export { getCoupons, createCoupon, deleteCoupon, validateCoupon };