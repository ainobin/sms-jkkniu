import { Router } from "express";
import { createProduct, getAllProducts, getProduct, stockUpdate } from "../controllers/product.contoller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isStoreManager } from "../middlewares/role.middleware.js";

const router = Router();

router.route('/createProduct').post(verifyJWT, isStoreManager, createProduct);
router.route('/getProduct').get(verifyJWT, getProduct);
router.route('/getAllProducts').get(verifyJWT, getAllProducts);
router.route('/stockUpdate').patch(verifyJWT, isStoreManager, stockUpdate);


export default router;