import { Router } from "express";
import { getTransactions } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isStoreManager } from "../middlewares/role.middleware.js";


const router = Router();

router.route('/:product_id').get(verifyJWT, isStoreManager, getTransactions);

export default router