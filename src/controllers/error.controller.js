function sendErrorDev(err, req, res, next) {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

export default function (err, req, res, next) {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  //will handle later
  //   if (process.env.NODE_ENV) {
  sendErrorDev(err, req, res, next);
  //   }
}
