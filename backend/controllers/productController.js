import Product from "../models/productModel.js";
import Order from '../models/orderModel.js';
//@desc lay tat ca san pham
//@route GET/api/product
// const getProducts = async (req, res)=>{
//     try{
//         const product = await Product.find({});
//         res.json(product);
//     }catch(error){
//         res.status(500).json({message : "Loi may chu"});
//     }
// };

const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, // $regex để tìm kiếm không phân biệt chữ hoa/thường
          $options: 'i',
        },
      }
    : {}; // Nếu không có keyword, để trống
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  // 3. Kết hợp các điều kiện tìm kiếm/lọc
  const products = await Product.find({ ...keyword, ...category });
  
  res.json(products);
};

//@desc  lay chi tiet mot san pham
//@route GET/api/product/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin

const createProduct = async (req, res)=>{
    const product = new Product({
        name: 'Tên sản phẩm',
        price: 0,
        user: req.user._id, // Giả định admin là người tạo
        image: '',
        brand: 'Hãng mẫu',
        category: 'Danh mục',
        countInStock: 0,
        description: 'Mô tả',
        specifications: {},
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Tạo đánh giá sản phẩm mới
// @route   POST /api/products/:id/reviews
// @access  Private (Cần đăng nhập)
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  //Lay user tu middleware 'protect'
  const user = req.user;

  //Kiem tra dieu kien (PB08)
  //Kiem tra xem user da mua san pham nay hay chua
  const orders = await Order.find({ 
    user: user._id, 
    'orderItems.product': productId,
    isPaid: true
  });

  if (orders.length === 0) {
    res.status(400);
    throw new Error('Bạn phải mua sản phẩm này trước khi được đánh giá');
  }
  //Kiem tra xem user da review san pham nay hay chua
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Bạn đã đánh giá sản phẩm này rồi');
  }

  //Tao review
  const review = {
    name: user.name || user.fullName, //Lay ten tu customer model
    rating: Number(rating),
    comment,
    user: user._id,
  };

  product.reviews.push(review);

  // 6. Cập nhật lại số lượng review và điểm trung bình
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Đánh giá đã được thêm' });
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock, specifications } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.specifications = specifications || product.specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Sản phẩm đã được xóa' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

// @desc    Lấy danh sách sản phẩm theo IDs (Dùng cho So sánh)
// @route   POST /api/products/compare
// @access  Public
const getProductsForComparison = async (req, res) => {
  const { productIds } = req.body; // Mảng chứa các ID: ["id1", "id2"]
  if (!productIds || productIds.length === 0) {
    res.status(400);
    throw new Error('Chưa chọn sản phẩm để so sánh');
  }
  // Tìm tất cả sản phẩm có _id nằm trong danh sách productIds
  const products = await Product.find({ _id: { $in: productIds } });
  res.json(products);
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsForComparison,
};