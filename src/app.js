import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "HELLO",
  });
});

export default app;
