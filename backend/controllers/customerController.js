import Customer from "../models/customerModel.js";
import generateToken from "../utils/generateToken.js";
import Product from '../models/productModel.js';
//@desc dang ky khach hang moi
//@route POST/api/customers
const registerCustomer = async (req, res)=>{
    const {email, name, phone, password} = req.body;

    try{
        const customerExists = await Customer.findOne({email});
        if(customerExists){
            return res.status(400).json({message : "Email da ton tai"});
        }
        //tao customer
        const customer = await Customer.create({email, name, phone, password});

        res.status(201).json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            token: generateToken(customer._id),
        });
    }catch(error){
        res.status(400).json({message: "Du lieu khong hop le", error: error.message})
    }
};

//desc dang nhap khach hang
//route POST/api/customer/login
const loginCustomer = async (req, res)=>{
    const {email, password}= req.body;

    try{
        const customer = await Customer.findOne({email});

        if(customer && (await customer.matchPassword(password))){
            res.json({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                token: generateToken(customer._id),
            });
        }else{
            res.status(401).json({message: "Email hoac mat khau khong chinh xac"});
        }
    }catch(error){
        res.status(500).json({message: "Loi may chu"});
    }
};
// export {registerCustomer, loginCustomer};

const getCustomerCart = async (req, res)=>{
    const customer = await Customer.findById(req.user._id);

    if(customer){
        res.json(customer.cart);
    }else{
        res.status(404);
        throw new Error('Không tìm thấy khách hàng');
    }
};

//@desc Them/cap nhat san pham trong gio hang
//@route POST /api/customer/cart
//@access Private
const addItemToCart = async(req, res)=>{
    const {productId, quantity} = req.body;
    const customer = await Customer.findById(req.user._id);

    if(!customer){
        res.status(404)
        throw new Error('Không tìm thấy khách hàng');
    }

    //lay thong tin san pham tu database
    const product = await Product.findById(productId);
    if(!product){
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }

    //kiem tra san pham da co trong gio hang chua
    const existItem = customer.cart.find(
        (item)=> item.product.toString()===productId
    );
    if(existItem){
        //neu co san pham trong gio hang thi chi cap nhat so luong
        existItem.quantity = Number(quantity);
    }else{
        //tao item moi neu chua co
        const cartItem = {
            name: product.name,
            quantity: Number(quantity),
            image: product.image,
            price: product.price,
            product: productId,
        };
        customer.cart.push(cartItem);
    }


    //luu lai vao database
    const updatedCustomer = await customer.save();
    res.status(201).json(updatedCustomer.cart);
};


//@desc xoa san pham khoi gio hang
//@route DELETE /api/customer/cart/:productId
//@access Private

const removeItemFromCart = async(req, res)=>{
    const{productId}=req.params;
    const customer = await Customer.findById(req.user._id);

    if(!customer){
        res.status(404);
        throw new Error('Không tìm thấy khách hàng');
    }

    //loai bo san pham can xoa
    customer.cart = customer.cart.filter(
        (item) => item.product.toString() !== productId
    );
    await customer.save();
    res.json(customer.cart);
};

export{
    registerCustomer,
    loginCustomer,
    getCustomerCart,
    addItemToCart,
    removeItemFromCart,
};