import Order from '../models/orderModel.js';
import Customer from '../models/customerModel.js';
 //@desc Tao don hang moi
 //@route POST /api/orders
 //@access Private
 const addOrderItems = async (req, res) =>{
    //fe se gui len totalPrice, shippingAddress, paymentMethod
    const { shippingAddress, paymentMethod, totalPrice } = req.body;
    
    //lay gio hang tu req.user
    const customer = await Customer.findById(req.user._id);
    const cartItems = customer.cart;

    if(cartItems && cartItems.length === 0){
        res.status(400);
        throw new Error('Không có sản phẩm nào trong giỏ hàng');
    }else{
        //tao don hang moi
        const order = new Order({
            orderItems: cartItems.map((item) =>({
                ...item,
                product: item.product,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        //luu don hang vao db
        const createdOrder = await order.save();

        //xoa gio hang cua nguoi dung sau khi dat hang
        customer.cart = [];
        await customer.save();

        //tra ve don hang da tao
        res.status(201).json(createdOrder);
    }
 };

export { addOrderItems };