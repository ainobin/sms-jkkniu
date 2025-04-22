import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    registerUser, 
    loginUser,
    logoutUser,
    changePassword,
    changeDetails,
    getCurrentUser,
    changeSignature,
    getRegisterSignature,
    getManagerSignature,
    getDeptAdminSignature,
    getAllDept
}from "../controllers/user.controller.js";
import { verifyJWT} from "../middlewares/auth.middleware.js";
import { isManagerOrRegistrar, isStoreManager } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/register").post(
    verifyJWT,
    isStoreManager,
    upload.fields([{
        name: "signature",
        maxCount: 1
    }]),
    registerUser 
);

router.route("/login").post(loginUser)
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/getRegisterSign").get(verifyJWT, getRegisterSignature)
router.route("/getManagerSign").get(verifyJWT, getManagerSignature)
router.route("/getDeptAdminSign/:id").get(verifyJWT, getDeptAdminSignature)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/change-details").patch(verifyJWT, changeDetails)
router.route("/change-signature").patch(verifyJWT, upload.single("signature"), changeSignature)
router.route("/all-dept").get(getAllDept)


router.route("/me").get(verifyJWT, getCurrentUser)

export default router;