import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/error-index.js";

// review later for updating for number of followers
export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password -savedPosts -isAdmin -notifications -blocked -posts -__v -following -followers -followingRequests"
  );

  res.status(StatusCodes.OK).json(user);
};
//all users can see basic profile info but only if you follow you can see posts that feature is handled in postsController
export const getUserProfile = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ _id: req.user.userId }).select(
    "-password -savedPosts -isAdmin -notifications -blocked -posts -__v -following -followers -followingRequests"
  );

  res.status(StatusCodes.OK).json(user);
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
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Privacy switched to ${privacy ? "Private" : "Public"}` });
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    await Post.deleteMany({ user: user._id });

    await User.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } }
    );
    await User.updateMany(
      { following: user._id },
      { $pull: { following: user._id } }
    );

    await user.remove();

    res.status(StatusCodes.OK).json({ msg: "Profile successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting profile" });
  }
};
