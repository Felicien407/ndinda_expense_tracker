import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri =/*  process.env.MONGO_ATLAS_URI ||  */process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set; start the server with database features disabled");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || "expense_tracker",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
