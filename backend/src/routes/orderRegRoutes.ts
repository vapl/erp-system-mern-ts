import express from 'express';
import * as orderRegController from "../controllers/orderRegController";

const router = express.Router();

router.post('/newOrder', orderRegController.createOrder);
router.post('/updateOrder', orderRegController.updateOrder);
router.get('/', orderRegController.getOrders);
router.get('/:fileId', orderRegController.downloadOrderDocument);
router.delete('/deleteOrder', orderRegController.deleteOrder);

export default router;