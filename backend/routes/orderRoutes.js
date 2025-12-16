import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderById} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
//route cua admin
router
  .route('/')
  .post(protect, addOrderItems) // (ham nay user cung dung)
  .get(protect, admin, getOrders); // (chi admin)
  
//route cua user
router.get('/myorders', protect, getMyOrders);
//route chung(co bao mat ben trong)
router.get('/:id', protect, getOrderById);
//route cap nhat cau admin
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
export default router;