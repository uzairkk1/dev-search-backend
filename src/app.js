import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "HELLO",
  });
});

export default app;
