import { Router } from "express";
import { getTransactions } from "../controllers/transaction.controller.js";


const router = Router();

router.route('/:product_id').get(getTransactions);

export default router