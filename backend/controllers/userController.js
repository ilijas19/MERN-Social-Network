import User from "../models/User.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";
import getCurrentUserFollowingStatus from "../utils/getUserFollowingStatus.js";

export const followUnfollow = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }

  if (req.user.userId === userId) {
    throw new CustomError.BadRequestError("You Cant Follow Yourself");
  }

  const user = await User.findOne({ _id: userId });
  const currentUser = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.BadRequestError("User Not Found");
  }
  //if following unfollow
  if (user.followers.includes(req.user.userId)) {
    user.followers = user.followers.filter(
      (follower) => follower.toString() !== req.user.userId.toString()
    );
    currentUser.following = currentUser.following.filter(
      (following) => following.toString() !== user._id.toString()
    );

    await user.save();
    await currentUser.save();
    return res.status(StatusCodes.OK).json({ msg: "User Unfollowed" });
  }
  //check if profile is private
  if (user.private) {
    //check if request is already sent
    if (user.followingRequests.includes(req.user.userId)) {
      user.followingRequests = user.followingRequests.filter(
        (request) => request.toString() !== req.user.userId.toString()
      );
      await user.save();
      return res.status(StatusCodes.OK).json({ msg: "Request Removed" });
    } else {
      user.followingRequests.push(req.user.userId);
      await user.save();
      return res.status(StatusCodes.OK).json({ msg: "Request Sent" });
    }
  }
  //follow user if its public
  user.followers.push(currentUser._id);
  currentUser.following.push(user._id);
  await user.save();
  await currentUser.save();
  return res.status(StatusCodes.OK).json({ msg: "User Followed" });
};

export const getFollowRequests = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).populate({
    path: "followingRequests",
    select: "_id username profilePicture",
  });
  res
    .status(StatusCodes.OK)
    .json({ followingRequests: user.followingRequests });
};

export const acceptFollowRequest = async (req, res) => {
  const { userId: userToAcceptId } = req.body;
  if (!userToAcceptId) {
    throw new CustomError.BadRequestError("userId must be provided to accept");
  }

  // Fetch both users at the msame time
  const [acceptedUser, currentUser] = await Promise.all([
    User.findById(userToAcceptId),
    User.findById(req.user.userId),
  ]);

  if (!acceptedUser || !currentUser) {
    throw new CustomError.NotFoundError("User not found");
  }

  if (!currentUser.followingRequests.includes(userToAcceptId)) {
    throw new CustomError.BadRequestError("User not in your requests");
  }

  if (currentUser.followers.includes(userToAcceptId)) {
    throw new CustomError.BadRequestError("User already follows you");
  }

  currentUser.followingRequests.pull(userToAcceptId); // remove request
  currentUser.followers.push(userToAcceptId); // Add follower
  acceptedUser.following.push(currentUser._id); // Add following

  await currentUser.save();
  await acceptedUser.save();

  res.status(StatusCodes.OK).json({ msg: "Request Accepted" });
};

export const declineFollowRequest = async (req, res) => {
  const { userId: declinedUserId } = req.body;
  if (!declinedUserId) {
    throw new CustomError.BadRequestError("userId must be provided to decline");
  }
  const declinedUser = await User.findOne({ _id: declinedUserId });
  if (!declinedUser) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  const currentUser = await User.findOne({ _id: req.user.userId });
  //check if user is in requests
  if (!currentUser.followingRequests.includes(declinedUserId)) {
    throw new CustomError.BadRequestError("User has not sent request");
  }
  currentUser.followingRequests = currentUser.followingRequests.filter(
    (request) => request.toString() !== declinedUserId.toString()
  );
  await currentUser.save();
  res.status(StatusCodes.OK).json({ msg: "Request Removed" });
};

export const removeFollower = async (req, res) => {
  const { userId: removingUserId } = req.body;
  if (!removingUserId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  if (removingUserId === req.user.userId) {
    throw new CustomError.BadRequestError("Can't remove yourself");
  }

  const [user, currentUser] = await Promise.all([
    User.findOne({ _id: removingUserId }),
    User.findOne({ _id: req.user.userId }),
  ]);

  if (!user || !currentUser) {
    throw new CustomError.NotFoundError("User not found");
  }

  // Check if user is actually following
  if (!currentUser.followers.includes(removingUserId)) {
    throw new CustomError.BadRequestError("User is not following you");
  }

  currentUser.followers = currentUser.followers.filter(
    (u) => u._id.toString() !== removingUserId.toString()
  );
  user.following = user.following.filter(
    (u) => u._id.toString() !== currentUser._id.toString()
  );

  await Promise.all([currentUser.save(), user.save()]);

  res.status(StatusCodes.OK).json({ msg: "Follower removed successfully" });
};

export const getFollowersList = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    throw new CustomError.BadRequestError("Username needs to be provided");
  }

  const user = await User.findOne({ username }).populate({
    path: "followers",
    select: "_id username profilePicture private followingRequests",
  });

  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }

  const currentUser = await User.findOne({ _id: req.user.userId });

  // Enrich followers with currentUserFollowing status
  const enrichedFollowers = user.followers.map((follower) => ({
    _id: follower._id,
    username: follower.username,
    currentUserFollowing: getCurrentUserFollowingStatus(follower, currentUser),
    profilePicture: follower.profilePicture,
  }));

  // For yourself
  if (user._id.toString() === req.user.userId.toString()) {
    return res.status(StatusCodes.OK).json({
      nbHits: user.followers.length,
      followers: enrichedFollowers,
    });
  }

  // Check if the user is private
  if (user.private) {
    const isFollowing = user.followers.some(
      (follower) => follower._id.toString() === req.user.userId.toString()
    );
    if (!isFollowing) {
      throw new CustomError.BadRequestError("Not Following");
    }
  }

  return res.status(StatusCodes.OK).json({
    nbHits: user.followers.length,
    followers: enrichedFollowers,
  });
};

export const getFollowingList = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    throw new CustomError.BadRequestError("Username needs to be provided");
  }

  const user = await User.findOne({ username }).populate({
    path: "following",
    select: "_id username profilePicture private followingRequests",
  });

  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }

  const currentUser = await User.findOne({ _id: req.user.userId });

  // Enrich following with currentUserFollowing status
  const enrichedFollowing = user.following.map((followingUser) => ({
    _id: followingUser._id,
    username: followingUser.username,
    currentUserFollowing: getCurrentUserFollowingStatus(
      followingUser,
      currentUser
    ),
    profilePicture: followingUser.profilePicture,
  }));

  // For yourself
  if (user._id.toString() === req.user.userId.toString()) {
    return res.status(StatusCodes.OK).json({
      nbHits: user.following.length,
      following: enrichedFollowing,
    });
  }

  // Check if the user is private
  if (user.private) {
    const isFollowing = user.followers.some(
      (follower) => follower._id.toString() === req.user.userId.toString()
    );
    if (!isFollowing) {
      throw new CustomError.BadRequestError("Not Following");
    }
  }

  return res.status(StatusCodes.OK).json({
    nbHits: user.following.length,
    following: enrichedFollowing,
  });
};

export const searchForUser = async (req, res) => {
  const { username, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!username) {
    throw new CustomError.BadRequestError("username must be provided");
  }

  // Get users and total count in parallel
  const [users, totalCount] = await Promise.all([
    User.find({
      username: { $regex: username.trim(), $options: "i" },
    })
      .select("_id username profilePicture")
      .skip(skip)
      .limit(limit),

    User.countDocuments({
      username: { $regex: username.trim(), $options: "i" },
    }),
  ]);

  const hasNextPage = totalCount > skip + limit;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  res.status(StatusCodes.OK).json({
    users,
    page: Number(page),
    nextPage,
    totalResults: totalCount,
  });
};
