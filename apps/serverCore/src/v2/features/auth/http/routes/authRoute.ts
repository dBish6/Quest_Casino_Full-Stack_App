import { Router } from "express";
import validateLogin from "@authFeatHttp/middleware/validateLogin";
import validateGoogleLogin from "@authFeatHttp/middleware/validateGoogleLogin";
import verifyUserToken from "@authFeat/middleware/tokens/verifyUserToken";
import { verifyCsrfToken, verifyVerificationToken } from "@authFeatHttp/middleware/tokens";
import userVerificationRequired from "@authFeat/middleware/userVerificationRequired";
import * as authController from "@authFeatHttp/controllers/authController";

const router = Router();

router.post("/register", authController.register);

router.post("/login", validateLogin, authController.login);
router.post("/login/google", validateGoogleLogin, authController.loginGoogle);

router.post("/email-verify", verifyVerificationToken, verifyUserToken, verifyCsrfToken, authController.emailVerify);
router.post("/email-verify/send", verifyUserToken, verifyCsrfToken, authController.sendVerifyEmail);

router.get("/users", verifyUserToken, authController.getUsers);
router.get("/user", verifyUserToken, authController.getUser);
router.get("/user/profile", verifyUserToken, authController.getUserProfile);
router.patch("/user", verifyUserToken, verifyCsrfToken, userVerificationRequired, authController.updateProfile);
router.patch("/user/favourites", verifyUserToken, verifyCsrfToken, authController.updateUserFavourites);

router.patch("/user/reset-password", verifyVerificationToken, authController.resetPassword);
router.post("/user/reset-password/confirm", verifyUserToken, verifyCsrfToken, userVerificationRequired, authController.sendConfirmPasswordEmail);
router.delete("/user/reset-password/revoke", verifyUserToken, verifyCsrfToken, authController.revokePasswordReset);

router.post("/user/reset-password/forgot", authController.sendForgotPasswordEmail);
// @ts-ignore
router.post("/user/reset-password/forgot/confirm", verifyVerificationToken, authController.sendConfirmPasswordEmail);

router.post("/user/wipe", verifyUserToken, verifyCsrfToken, authController.wipeUser);
router.delete("/user", verifyUserToken, verifyCsrfToken, authController.deleteUser);
router.delete("/user/favourites", verifyUserToken, verifyCsrfToken, authController.updateUserFavourites);
router.delete("/user/notifications", verifyUserToken, verifyCsrfToken, authController.deleteUserNotifications);

router.post("/user/refresh", authController.refresh);
router.post("/user/logout", authController.logout);

export default router;
