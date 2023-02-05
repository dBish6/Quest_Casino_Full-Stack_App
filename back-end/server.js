// *Imports*
const express = require("express");
const app = express();

// const fbFunctions = require('firebase-functions');
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const helmet = require("helmet");
// const hpp = require("hpp");
// const csurf = require("csurf");
// const rateLimit = require("express-rate-limit");

global.DEBUG = true;

const PORT = process.env.PORT || 4000;

// *Middleware*
// Event Emitters
if (DEBUG) app.use(morgan("dev"));
// So express can read the new parameters off the url and encoding them correctly.
app.use(bodyParser.urlencoded({ extended: true }));
// For fetching data.
app.use(bodyParser.json());

// cors allows different domain applications to interact with each other.
app.use(
  cors({
    origin: "http://localhost:3000", // Location of client side; react app.
    // credentials: true, // Allows the server to read cookies for different domains.
  })
);
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Access-Control-Allow-Headers"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true); // For cookie.
//   next();
// });

// Security Configs
// app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
// app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.

// Security - protects against Cross-site request forgery.
// app.use(csurf());
// Rate-limiting - used to limit repeated requests to public APIs and/or endpoints such as password resets.
// app.use(
//   rateLimit({
//     windowMs: 60 * 60 * 1000, // 60 minutes, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message:
//       "Too many requests made from this IP, please try again after an hour",
//   })
// );

// *Routers*
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// exports.nodeAPI = functions.https.onRequest(app);

app.listen(PORT, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
  );
});
