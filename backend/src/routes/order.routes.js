import { Router } from "express";
import {createOrder, getOrders, getOrderById, managerApproval, regesterApproval} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createOrder').post(createOrder);
router.route('/getAllOrders').get(getOrders);
router.route('/managerApproval').patch(managerApproval);
router.route('/registerAprroval').patch(regesterApproval);

export default router;