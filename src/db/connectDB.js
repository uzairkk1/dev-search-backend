import mongoose from "mongoose";

export default async function () {
  return await mongoose.connect(process.env.DB_URL);
}

mongoose.connection.on("disconnected", (err) => {
  console.log("Mongoose disconnected: ", err);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
});
