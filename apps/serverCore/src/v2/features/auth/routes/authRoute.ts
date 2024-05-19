import { Router } from "express";
import { verifyUserToken, verifyCsrfToken } from "../middleware/tokens";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/users", verifyUserToken, authController.getUsers);
router.get("/user", verifyUserToken, authController.getUser);

router.post("/register", authController.register);
// router.post("/register/google", verifyCsrfToken, authController.register);
router.post("/login", verifyUserToken, verifyCsrfToken, authController.login);
// router.post("/login/google", verifyCsrfToken, verifyUserIdToken, authController.login);
// router.post("/refresh", verifyCsrfToken, verifyTokens.verifyRefreshToken, authController.refresh);
router.post("/email-verify", verifyUserToken, verifyCsrfToken, authController.emailVerify);
router.post("/email-verify/send", verifyUserToken, verifyCsrfToken, authController.sendVerifyEmail);

router.post("/logout", verifyUserToken, verifyCsrfToken, authController.logout);

router.post("/current-user/clear", verifyUserToken, verifyCsrfToken, authController.clear);

router.delete("/delete", verifyUserToken, verifyCsrfToken, authController.logout);

// Password reset route.
// Update profile route.
// Ban route (disables user).

export default router;
