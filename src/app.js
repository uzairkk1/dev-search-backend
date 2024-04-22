import express from "express";
import morgan from "morgan";

import AppError from "./utils/AppError.js";

//controllers
import errorController from "./controllers/error.controller.js";

//routers
import projectRouter from "./routes/projects.route.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "HELLO",
  });
});

app.use("/api/v1/projects", projectRouter);

//route catching
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

export default app;
