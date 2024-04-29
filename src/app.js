import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import AppError from "./utils/AppError.js";

//controllers
import errorController from "./controllers/error.controller.js";

//routers
import projectRouter from "./routes/projects.route.js";
import reviewRouter from "./routes/review.route.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js";

import { check } from "express-validator";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "HELLO",
  });
});

app.get("/validate-email", async (req, res, next) => {
  const query = req.query.email;
  console.log(query);
  const isValid = await check(query)
    .isEmail()
    .withMessage("Invalid Email address")
    .run(this);
  console.log(isValid);
  return res.status(200).json({
    status: isValid,
  });
});

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/users", userRouter);

//route catching
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

export default app;
