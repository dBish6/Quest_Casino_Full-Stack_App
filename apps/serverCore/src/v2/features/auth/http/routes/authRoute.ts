import { Router } from "express";
import validateLogin from "@authFeatHttp/middleware/validateLogin";
import validateGoogleLogin from "@authFeatHttp/middleware/validateGoogleLogin";
import { verifyUserToken, verifyCsrfToken } from "@authFeatHttp/middleware/tokens";
import * as authController from "@authFeatHttp/controllers/authController";

const router = Router();

router.post("/register", authController.register);

router.post("/login", validateLogin, authController.login);
router.post("/login/google", validateGoogleLogin, authController.loginGoogle);

router.post("/email-verify", verifyUserToken, verifyCsrfToken, authController.emailVerify);
router.post("/email-verify/send", verifyUserToken, verifyCsrfToken, authController.sendVerifyEmail);

router.get("/users", verifyUserToken, authController.getUsers);
router.get("/user", verifyUserToken, authController.getUser);
router.patch("/user", verifyUserToken, verifyCsrfToken, authController.updateProfile);
router.patch("/user/favourites", verifyUserToken, verifyCsrfToken, authController.updateUserFavourites);

// TODO: router.patch("/user/forgot-password", verifyUserToken, verifyCsrfToken, authController.resetPassword);
// TODO: router.post("/user/forgot-password/send", verifyUserToken, verifyCsrfToken, authController.resetPassword);
router.patch("/user/reset-password", verifyUserToken, verifyCsrfToken, authController.resetPassword);
router.post("/user/reset-password/send", verifyUserToken, verifyCsrfToken, authController.sendResetPasswordEmail);

router.post("/user/clear", verifyUserToken, verifyCsrfToken, authController.clear);
router.delete("/user", verifyUserToken, verifyCsrfToken, authController.deleteUser);
router.delete("/user/favourites", verifyUserToken, verifyCsrfToken, authController.updateUserFavourites);
router.delete("/user/notifications", verifyUserToken, verifyCsrfToken, authController.deleteUserNotifications);

router.post("/logout", authController.logout);

// TODO: Password reset route.
// TODO: Update profile route.
// TODO: Ban route (disables user).

export default router;
