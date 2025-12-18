import express, { Router } from 'express';
const router = express.Router();
import{
    registerCustomer,
    loginCustomer,
    getCustomerCart,
    addItemToCart,
    removeItemFromCart,
    updateUserProfile,
    updateCartItemQuantity,
    getCustomers,
    deleteUser,
    getUserById,
    updateUser
}from '../controllers/customerController.js';
import { protect, admin} from '../middleware/authMiddleware.js';
//cac routes cong khai
router.post('/',registerCustomer);
router.post('/login',loginCustomer);
//cac routes rieng tu
router
    .route('/cart')
    //GET /api/customer/cart
    .get(protect, getCustomerCart)
    //POST /api/customer/cart
    .post(protect, addItemToCart)
    .put(protect, updateCartItemQuantity);

//route xoa item
//DELETE /api/customer/cart/:productId
router.delete('/cart/:productId', protect, removeItemFromCart);

router
    .route('/profile')
    // .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/', protect, admin, getCustomers);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
export default router;

