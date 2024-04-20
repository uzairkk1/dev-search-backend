import "dotenv/config";
import connectDB from "./db/connectDB.js";

import app from "./app.js";

try {
  await connectDB();
  console.log("DB Connected Successfully");
  app.listen(3019, () => {
    console.log(`Server started on port 3019`);
  });
} catch (error) {
  console.log("Something went wrong while connecting to app", error);
}
