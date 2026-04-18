import { Router } from "express";
import { loginController, registerController } from "./auth.controller";

const router = Router();

router.post("/register", registerController); // POST /api/auth/register
router.post("/login", loginController);       // POST /api/auth/login

export default router;