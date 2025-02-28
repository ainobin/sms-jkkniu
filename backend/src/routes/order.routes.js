import { Router } from "express";
import {createOrder, getOrders, getOrderById, storeManager, regesterApproval} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createOrder').post(createOrder);
router.route('/getAllOrders').get(getOrders);
router.route('/storeManager').patch(storeManager);
router.route('/register').patch(regesterApproval);

export default router;