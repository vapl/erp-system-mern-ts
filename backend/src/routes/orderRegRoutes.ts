import express from 'express';
import multer from 'multer';
import * as orderRegController from "../controllers/orderRegController";

const router = express.Router();

// PDF augšupielādes konfigurācija
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/newOrder', upload.single('orderTechDoc'), orderRegController.createOrder);
router.post('/updateOrder', orderRegController.updateOrder);
router.get('/', orderRegController.getOrders);
router.get('/:fileId', orderRegController.downloadOrderDocument);

export default router;