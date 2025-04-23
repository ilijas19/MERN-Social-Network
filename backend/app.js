//packages
import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
//db
import connectDb from "./db/connectDb.js";
//middlewares
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
//routes
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4999;
const init = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    await connectDb();
  } catch (error) {
    console.log(error);
  }
};
init();
