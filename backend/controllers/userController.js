import User from "../models/User.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";

export const followUnfollow = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }

  if (req.user.userId === userId) {
    throw new CustomError.BadRequestError("You Cant Follow Yourself");
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.BadRequestError("User Not Found");
  }
  //check if profile is private
  //check if already following then unfollow
  //check if already send request to user.followingRequests then remove it
  //send request if profile is private
  //follow user
};

export const getFollowRequests = async (req, res) => {
  res.send("getFollowRequests");
};

export const acceptFollowRequest = async (req, res) => {
  res.send("acceptFollowRequest");
};

export const declineFollowRequest = async (req, res) => {
  res.send("declineFollowRequest");
};

export const getFollowersList = async (req, res) => {
  res.send("getFollowersList");
};

export const getFollowingList = async (req, res) => {
  res.send("getFollowingList");
};

export const searchForUser = async (req, res) => {
  res.send("searchForUser");
};
