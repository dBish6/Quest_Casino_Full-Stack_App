import { Router } from "express";
import * as csrfController from "../controllers/csrfController";

const router = Router();

router.get("/init", csrfController.initializeCsrfToken);

export default router;
