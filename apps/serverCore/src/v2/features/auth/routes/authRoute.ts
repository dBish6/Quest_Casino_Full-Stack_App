import { Router } from "express";
import verifySessionCookie from "../middleware/verifySessionCookie";
import verifyUserIdToken from "../middleware/verifyUserIdToken";
import verifyCsrfToken from "@csrfFeat/middleware/verifyCsrfToken";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/users", verifySessionCookie, authController.getUsers);
router.get("/user", verifySessionCookie, authController.getUser);

router.get("/users", authController.getUsers);
router.get("/current-user", authController.getUser);

router.post("/register", authController.register);
// router.post("/register/google", verifyCsrfToken, authController.register);
router.post("/login", verifyUserIdToken, verifyCsrfToken, authController.login);
// router.post("/login/google", verifyCsrfToken, verifyUserIdToken, authController.login);
// router.post("/refresh", verifyCsrfToken, verifyTokens.verifyRefreshToken, authController.refresh);
router.get("/email/verify", verifySessionCookie, authController.emailVerify);

router.post("/logout", verifySessionCookie, verifyCsrfToken, authController.logout);

router.delete("/delete", verifySessionCookie, verifyCsrfToken, authController.logout);

// Password reset route.
// Update profile route.
// Ban route (disables user).

export default router;
