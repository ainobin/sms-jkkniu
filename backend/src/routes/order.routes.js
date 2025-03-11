import { Router } from "express";
import {createOrder, getOrders, getOrdersByDeptId, managerApproval, regesterApproval} from "../controllers/order.controller.js"


const router = Router();

router.route('/createOrder').post(createOrder);
router.route('/getAllOrders').get(getOrders);
router.route('/getOrders/:id').get(getOrdersByDeptId);
router.route('/managerApproval').patch(managerApproval);
router.route('/registerAprroval').patch(regesterApproval);

export default router;