import { Router } from "express";
import { verifyUserToken, verifyCsrfToken } from "@authFeatHttp/middleware/tokens";
import { validateRegister, validateLogin } from "@authFeatHttp/middleware/formValidation";
import validateGoogleLogin from "@authFeatHttp/middleware/validateGoogleLogin";
import * as authController from "@authFeatHttp/controllers/authController";

const router = Router();

router.get("/users", verifyUserToken, authController.getUsers);
router.get("/user", verifyUserToken, authController.getUser); 
router.post("/user/clear", verifyUserToken, verifyCsrfToken, authController.clear);

router.post("/register", validateRegister, authController.register);

router.post("/login", validateLogin, authController.login);
router.post("/login/google", validateGoogleLogin, authController.loginGoogle);
// router.post("/refresh", authController.refresh);
router.post("/email-verify", verifyUserToken, verifyCsrfToken, authController.emailVerify);
router.post("/email-verify/send", verifyUserToken, verifyCsrfToken, authController.sendVerifyEmail);

router.post("/logout", verifyUserToken, verifyCsrfToken, authController.logout);

router.delete("/delete", verifyUserToken, verifyCsrfToken, authController.logout);

// TODO: Password reset route.
// TODO: Update profile route.
// TODO: Ban route (disables user).

export default router;
