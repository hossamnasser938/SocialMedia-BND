import dotenv from "dotenv";
import { connectDB } from "./connectDb";

export const prepareServer = () => {
  dotenv.config();

  return connectDB();
};
