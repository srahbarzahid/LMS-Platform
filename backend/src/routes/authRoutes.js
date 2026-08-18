import { Router } from "express";
import { register, login, me, logout, refreshToken } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
