import User from "../models/User.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json(users);
};

export const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("All credentials must be provided");
  }
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json(user);
};
