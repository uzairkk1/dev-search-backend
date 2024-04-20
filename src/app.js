import express from "express";
import morgan from "morgan";

import AppError from "./utils/AppError.js";

//controllers
import errorController from "./controllers/error.controller.js";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "HELLO",
  });
});

//route catching
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

export default app;
