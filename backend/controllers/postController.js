import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/error-index.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const createPost = async (req, res) => {
  const { image, text, type } = req.body;

  if (!type) {
    throw new CustomError.BadRequestError("Type of post must be provided");
  }

  if (type === "image") {
    if (!image || image === "") {
      throw new CustomError.BadRequestError("Image is required for post type");
    }
  }

  if (type === "text") {
    if (image && image !== "") {
      throw new CustomError.BadRequestError(
        "Cannot upload image for text post"
      );
    }
    if (!text || text === "") {
      throw new CustomError.BadRequestError(
        "Text must be provided for text post"
      );
    }
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }

  const post = await Post.create({
    user: req.user.userId,
    image: image || "",
    text: text || "",
    type,
  });

  user.posts.push(post._id);
  await user.save();

  res.status(StatusCodes.CREATED).json({ msg: "Post created" });
};

//here
export const getMyPosts = async (req, res) => {
  const { type } = req.body;
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const queryObject = {
    user: req.user.userId,
  };

  if (type) {
    queryObject.type = type;
  }

  const totalPosts = await Post.countDocuments(queryObject);

  const posts = await Post.find(queryObject)
    .select("-comments -__v")
    .populate({ path: "user", select: "username profilePicture" })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const currentUser = await User.findOne({ _id: req.user.userId });

  const enrichedPosts = posts.map((post) => {
    const isLiked = post.likes.includes(currentUser._id);
    const isSaved = currentUser.savedPosts.includes(post._id);

    return {
      ...post.toObject(),
      isLiked,
      isSaved,
    };
  });

  const hasNextPage = skip + posts.length < totalPosts;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  res.status(StatusCodes.OK).json({
    totalPosts,
    currentPage: Number(page),
    nextPage,
    posts: enrichedPosts,
  });
};

//here
export const getUserPosts = async (req, res) => {
  const { id: userId } = req.params;
  const { page = 1 } = req.query;

  const limit = 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }

  // Privacy check
  if (user.private && user._id.toString() !== req.user.userId) {
    const isFollowing = user.followers.some(
      (followerId) => followerId.toString() === req.user.userId
    );
    if (!isFollowing) {
      throw new CustomError.BadRequestError("User Posts Are Private");
    }
  }

  const posts = await Post.find({ user: userId })
    .select("-comments -__v")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const currentUser = await User.findOne({ _id: req.user.userId });

  const enrichedPosts = posts.map((post) => {
    const isLiked = post.likes.includes(currentUser._id);
    const isSaved = currentUser.savedPosts.includes(post._id);

    return {
      ...post.toObject(),
      isLiked,
      isSaved,
    };
  });

  const totalPosts = await Post.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalPosts / limit);

  res.status(StatusCodes.OK).json({
    currentPage: Number(page),
    nextPage: +page >= totalPages ? null : +page + 1,
    totalPosts,
    posts: enrichedPosts,
  });
};

//here
export const getSinglePost = async (req, res) => {
  const { id: postId } = req.params;
  if (!postId) {
    throw new CustomError.BadRequestError("postId needs to be provided");
  }
  const post = await Post.findById(postId)
    .select("-comments")
    .populate({ path: "user", select: "username profilePicture" });
  if (!post) {
    throw new CustomError.BadRequestError("Post Not Found");
  }
  const currentUser = await User.findOne({ _id: req.user.userId });
  const isLiked = post.likes.includes(currentUser._id);
  const isSaved = currentUser.savedPosts.includes(post._id);

  const modifiedPost = {
    ...post.toObject(),
    isLiked,
    isSaved,
  };
  res.status(StatusCodes.OK).json(modifiedPost);
};

export const editPost = async (req, res) => {
  const { text } = req.body;
  const { id: postId } = req.params;
  if (!postId) {
    throw new CustomError.BadRequestError("postId needs to be provided");
  }
  const post = await Post.findOne({ _id: postId, user: req.user.userId });
  if (!post) {
    throw new CustomError.BadRequestError("Post Not Found");
  }
  post.text = text || post.text;
  await post.save();
  res.status(StatusCodes.OK).json({ msg: "Post Updated" });
};

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  if (!postId) {
    throw new CustomError.BadRequestError("postId needs to be provided");
  }

  const post = await Post.findOne({ _id: postId, user: req.user.userId });

  if (!post) {
    throw new CustomError.BadRequestError("Post Not Found");
  }

  await post.deleteOne();

  await Comment.deleteMany({ post: postId });

  res.status(StatusCodes.OK).json({ msg: "Post Deleted" });
};

export const saveUnsavePost = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new CustomError.NotFoundError({ msg: "Post Not Found" });
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }
  if (user.savedPosts.includes(post._id)) {
    user.savedPosts = user.savedPosts.filter(
      (post) => post.toString() !== postId.toString()
    );
    await user.save();
    return res.status(StatusCodes.OK).json({ msg: "Removed From Favorites" });
  } else {
    user.savedPosts.push(postId);
    await user.save();
    return res.status(StatusCodes.OK).json({ msg: "Added To Favorites" });
  }
};
//here
export const getSavedPosts = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).populate({
    path: "savedPosts",
    select: "-comments ",
    populate: {
      path: "user",
      select: "username profilePicture",
    },
  });
  const currentUser = await User.findOne({ _id: req.user.userId });

  const enrichedPosts = user.savedPosts.map((post) => {
    const isLiked = post.likes.includes(currentUser._id);
    const isSaved = currentUser.savedPosts.includes(post._id);

    return {
      ...post.toObject(),
      isLiked,
      isSaved,
    };
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }
  res
    .status(StatusCodes.OK)
    .json({ nbHits: user.savedPosts.length, savedPosts: enrichedPosts });
};

export const likeUnlikePost = async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    throw new CustomError.BadRequestError("postId Must Be Provided");
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new CustomError.NotFoundError("Post Not Found");
  }
  if (post.likes.includes(req.user.userId)) {
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user.userId
    );
    await post.save();
    return res.status(StatusCodes.OK).json({ msg: "Like Removed" });
  } else {
    post.likes.push(req.user.userId);
    await post.save();
    return res.status(StatusCodes.OK).json({ msg: "Liked" });
  }
};

export const getPostLikes = async (req, res) => {
  const { id: postId } = req.params;
  if (!postId) {
    throw new CustomError.BadRequestError("Post Id Needs To Be Provided");
  }
  const post = await Post.findOne({ _id: postId }).populate({
    path: "likes",
    select: "_id username profilePicture",
  });
  if (!post) {
    throw new CustomError.NotFoundError("Post Not Found");
  }
  res
    .status(StatusCodes.OK)
    .json({ nbHits: post.likes.length, likes: post.likes });
};

//here
export const getFollowingUserPosts = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }

  const totalPosts = await Post.countDocuments({
    user: { $in: user.following },
  });

  const posts = await Post.find({ user: { $in: user.following } })
    .populate({ path: "user", select: "username profilePicture" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  const currentUser = await User.findOne({ _id: req.user.userId });

  const enrichedPosts = posts.map((post) => {
    const isLiked = post.likes.includes(currentUser._id);
    const isSaved = currentUser.savedPosts.includes(post._id);

    return {
      ...post.toObject(),
      isLiked,
      isSaved,
    };
  });

  const hasNextPage = skip + posts.length < totalPosts;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  res.status(StatusCodes.OK).json({
    totalPosts,
    currentPage: Number(page),
    nextPage,
    posts: enrichedPosts,
  });
};
//here
export const getExploreSectionPosts = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const currentUser = await User.findById(req.user.userId);
  if (!currentUser) {
    throw new CustomError.UnauthenticatedError("Authentication Error");
  }

  // Get all public users except current user
  const publicUsers = await User.find({
    _id: { $ne: req.user.userId },
    private: false,
  }).select("_id");

  // Include followed users (even if private)
  const followedUserIds = currentUser.following;

  // Merge and deduplicate user IDs
  const userIds = [
    ...new Set([
      ...publicUsers.map((u) => u._id.toString()),
      ...followedUserIds.map((id) => id.toString()),
    ]),
  ];

  const totalPosts = await Post.countDocuments({ user: { $in: userIds } });

  const posts = await Post.find({ user: { $in: userIds } })
    .populate({ path: "user", select: "username profilePicture" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  const enrichedPosts = posts.map((post) => {
    const isLiked = post.likes.includes(currentUser._id);
    const isSaved = currentUser.savedPosts.includes(post._id);

    return {
      ...post.toObject(),
      isLiked,
      isSaved,
    };
  });

  const hasNextPage = skip + posts.length < totalPosts;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  res.status(StatusCodes.OK).json({
    totalPosts,
    currentPage: Number(page),
    nextPage,
    posts: enrichedPosts,
  });
};
