/* Quest Casino's Server

   Author: David Bishop
   Creation Date: February 17, 2023
*/

// *Imports*
const express = require("express");
const app = express();

const { region } = require("firebase-functions");
const deleteInactiveProfilePictures = require("./authentication/utils/deleteInactiveProfilePictures");
const deleteInactiveGameSessions = require("./games/utils/deleteInactiveGameSessions");

require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const authRouter = require("./authentication/route/auth");
const gamesRouter = require("./games/route/games");

global.DEBUG = true;

// *Exports for Firebase Functions*
exports.server = region("northamerica-northeast1").https.onRequest(app);
exports.deleteInactiveProfilePictures = region("northamerica-northeast1")
  .pubsub.schedule("every 24 hours")
  .onRun(deleteInactiveProfilePictures);

exports.deleteInactiveGameSessions = region("northamerica-northeast1")
  .pubsub.schedule("every 24 hours")
  .onRun(deleteInactiveGameSessions);

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
    origin: [
      "http://localhost:3000",
      `https://${process.env.PROJECT_ID}.web.app`,
      `https://${process.env.PROJECT_ID}.firebaseapp.com`,
      "https://questcasino.xyz",
    ], // Location of client side; react app.
    credentials: true, // Allows for sending credentials like cookies.
  })
);

// *Security*
app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.

// Rate-limiting - used to limit repeated requests.
app.use((req, res, next) => {
  if (!req.path.includes("/games")) {
    console.log("req.path", req.path);
    rateLimit({
      windowMs: 60 * 60 * 1000, // 60 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message:
        "Too many requests made from this IP, please try again after an hour.",
    })(req, res, next);
  } else {
    next();
  }
});

// *Routers*
app.use("/auth", authRouter);
app.use("/games", gamesRouter);

// app.listen(4000, "localhost", () => {
//   console.log(
//     "Server is running on http://localhost:4000; Ctrl-C to terminate..."
//   );
// });
