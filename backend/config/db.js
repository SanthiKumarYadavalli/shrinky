import mongoose from "mongoose";
import { ATLAS_URI } from "../config/server.js";

const connectDB = async () => {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log("MongoDb connected");
  } catch (error) {
    console.error("Error in conncecting", error.message);
    process.exit(1);
  }
};
export default connectDB;
