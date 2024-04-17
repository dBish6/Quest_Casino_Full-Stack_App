/**
 * Api Entry File
 *
 * Description:
 * Setup for HTTP requests and responses.
 */

import { CorsOptions } from "cors";
import express from "express";

import bodyParser from "body-parser";

import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import apiErrorHandler from "@middleware/apiErrorHandler";

import authRouter from "@authFeat/routes/authRoute";
// import chatRouter from "@chatFeat/routes/chatRoute";
// import csrfRouter from "@csrfFeat/routes/csrfRoute";

const initializeApi = (corsOptions: CorsOptions) => {
  const app = express(),
    baseUrl = "/api/v2";

  // **Middleware**
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // *Security*
  app.use(cors(corsOptions));
  app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
  app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.
  // Rate-limiting - used to limit repeated requests.
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000, // 60 Minutes
      max: 55, // limit each IP to 55 requests per windowMs.
      message:
        "Too many requests made from this IP, please try again after an hour.",
    })
  );

  // Request logger.
  // morgan.token("all-headers", (req) => {
  //   return JSON.stringify(req.headers, null, 2);
  // });
  // app.use(
  //   morgan(":method :url :status :response-time ms \n headers: :all-headers")
  // );
  app.use(morgan("dev"));

  // Custom error handler for responses.
  app.use(apiErrorHandler);

  // *Routers*
  app.use(`${baseUrl}/auth`, authRouter);
  // app.use(`${baseUrl}/chat`, chatRouter);
  // app.use(`${baseUrl}/csrf`, csrfRouter);

  // Test Entry Route
  app.get("/", async (req, res) => {
    res.json({ message: "Quest Casino api online!" });
  });

  return app;
};

export default initializeApi;
