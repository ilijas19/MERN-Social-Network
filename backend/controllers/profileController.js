import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/error-index.js";
import mongoose from "mongoose";
import Post from "../models/Post.js";

// review later for updating for number of followers
export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password -savedPosts -isAdmin -notifications -blocked -posts -__v -following -followers -followingRequests"
  );

  res.status(StatusCodes.OK).json(user);
};

////////////
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new CustomError.BadRequestError("username needs to be provided");
  }

  const targetUser = await User.findOne({ username }).select(
    "-password -savedPosts -isAdmin -notifications -blocked -posts -__v"
  );

  if (!targetUser) {
    throw new CustomError.NotFoundError("User not found");
  }

  const currentUser = await User.findById(req.user.userId);

  let followingStatus = "follow";
  let wantsToFollowMe;

  if (targetUser.followers.includes(currentUser._id)) {
    followingStatus = "following";
  } else if (targetUser.followingRequests.includes(currentUser._id)) {
    followingStatus = "request sent";
  }

  if (currentUser.followingRequests.includes(targetUser._id)) {
    wantsToFollowMe = true;
  } else {
    wantsToFollowMe = false;
  }

  const { followingRequests, followers, following, ...cleanUser } =
    targetUser.toObject();

  res.status(StatusCodes.OK).json({
    ...cleanUser,
    following: followingStatus,
    wantsToFollowMe,
  });
};

export const updateProfile = async (req, res) => {
  const { profilePicture, coverPhoto, username, bio } = req.body;
  const user = await User.findOne({ _id: req.user.userId });

  user.profilePicture = profilePicture || user.profilePicture;
  user.coverPhoto = coverPhoto || user.coverPhoto;
  user.username = username || user.username;
  user.bio = bio || user.bio;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, repeatPassword } = req.body;
  if (!currentPassword || !newPassword || !repeatPassword) {
    throw new CustomError.BadRequestError("All credentials must be provided");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }
  if (newPassword !== repeatPassword) {
    throw new CustomError.BadRequestError("Passwords Do Not Match");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

export const changeProfilePrivacy = async (req, res) => {
  const { privacy } = req.body;
  const user = await User.findOne({ _id: req.user.userId });

  user.private = privacy;
  user.followingRequests = [];
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Privacy switched to ${privacy ? "Private" : "Public"}` });
};

export const deleteProfile = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    throw new CustomError.BadRequestError("Password Must be provided");
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = await User.findById(req.user.userId).session(session);
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }

  // Get all posts by this user
  const userPosts = await Post.find({ user: user._id }).session(session);

  // Remove likes from all of the user's posts
  await Promise.all([
    // Remove likes from posts
    Post.updateMany(
      { _id: { $in: userPosts.map((p) => p._id) } },
      { $set: { likes: [] } },
      { session }
    ),

    // Remove user's likes from other posts
    Post.updateMany(
      { likes: user._id },
      { $pull: { likes: user._id } },
      { session }
    ),

    // Remove from followers/following
    User.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } },
      { session }
    ),
    User.updateMany(
      { following: user._id },
      { $pull: { following: user._id } },
      { session }
    ),

    // Remove from any followingRequests
    User.updateMany(
      { followingRequests: user._id },
      { $pull: { followingRequests: user._id } },
      { session }
    ),
  ]);

  // Delete all user posts
  await Post.deleteMany({ user: user._id }).session(session);

  // Delete the user
  await user.deleteOne({ session });

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ msg: "Profile successfully deleted" });

  session.endSession();
};
