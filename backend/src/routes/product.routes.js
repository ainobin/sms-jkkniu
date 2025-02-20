import { Router } from "express";
import { createProduct, getAllProducts, getProduct, stockUpdate } from "../controllers/product.contoller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createProduct').post(createProduct);
router.route('/getProduct').get(getProduct);
router.route('/getAllProducts').get(getAllProducts);
router.route('/stockUpdate').patch(stockUpdate);


export default router;