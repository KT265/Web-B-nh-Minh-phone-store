import Product from "../models/productModel.js";
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

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};