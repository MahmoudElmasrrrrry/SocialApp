import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("Database connected!");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
};

export default connectDB;
