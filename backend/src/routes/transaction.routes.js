import { Router } from "express";
import { getTransactions, getTransactionsByDept } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isManagerOrRegistrar } from "../middlewares/role.middleware.js";


const router = Router();

router.route('/:product_id').get(verifyJWT, isManagerOrRegistrar, getTransactions);
router.route('/dept/:dept_id').get(verifyJWT, isManagerOrRegistrar, getTransactionsByDept);

export default router