// *Imports*
const express = require("express");
const app = express();

require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const { region } = require("firebase-functions");
const authRouter = require("./authentication/routes/auth");

global.DEBUG = true;

// *Middleware*
// So express can read the new parameters off the url and encoding them correctly.
app.use(bodyParser.urlencoded({ extended: true }));
// For fetching data.
app.use(bodyParser.json());
// Reading cookies.
app.use(cookieParser());

// cors allows different domain applications to interact with each other.
app.use(
  cors({
    origin: "http://localhost:3000", // Location of client side; react app.
    credentials: true, // Allows for sending credentials like cookies.
  })
);

// *Security*
app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.

// Rate-limiting - used to limit repeated requests.
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      "Too many requests made from this IP, please try again after an hour",
  })
);

// *Routers*
app.use("/auth", authRouter);

exports.server = region("northamerica-northeast1").https.onRequest(app);
