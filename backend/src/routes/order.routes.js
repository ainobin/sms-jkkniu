import { Router } from "express";
import {createOrder, getOrders, getOrdersByDeptId, managerApproval, regesterApproval} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isDeptAdmin } from "../middlewares/role.middleware.js";
import { isStoreManager } from "../middlewares/role.middleware.js";
import { isRegister } from "../middlewares/role.middleware.js";

const router = Router();

router.route('/createOrder').post(verifyJWT, isDeptAdmin, createOrder);
router.route('/getAllOrders').get(verifyJWT, getOrders);
router.route('/getOrders/:id').get(verifyJWT, isDeptAdmin, getOrdersByDeptId);
router.route('/managerApproval').patch(verifyJWT, isStoreManager, managerApproval);
router.route('/registerAprroval').patch(verifyJWT, isRegister, regesterApproval);

export default router;