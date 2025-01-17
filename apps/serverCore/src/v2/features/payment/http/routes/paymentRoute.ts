import { Router } from "express";
import verifyUserToken from "@authFeat/middleware/tokens/verifyUserToken";
import { verifyCsrfToken } from "@authFeatHttp/middleware/tokens";
import * as paymentController from "@paymentFeatHttp/controllers/paymentController";

const router = Router();

router.post("/transaction", verifyUserToken, verifyCsrfToken, paymentController.transaction);

router.get("/history", verifyUserToken, paymentController.getPaymentHistory);

export default router;
