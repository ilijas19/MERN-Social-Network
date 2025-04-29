export type MessageRes = {
  msg: string;
};

export type CurrentUser = {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

//AUTH
export type RegisterArgs = {
  username: string;
  email: string;
  password: string;
};

export type LoginArgs = {
  email: string;
  password: string;
};

export type LoginRes = {
  msg: string;
  tokenUser: CurrentUser;
};
//POSTS
export type Post = {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  image: string;
  text: string;
  numLikes: number;
  numComments: number;
  type: "image" | "text";
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  isSaved: boolean;
};

export type CreatePostArg = {
  image: string;
  text: string;
  type: "image" | "text";
};

export type GetMyPostsRes = {
  totalPosts: number;
  currentPage: number;
  nextPage: number | null;
  posts: Post[];
};

export type GetSavedPostsRes = {
  nbHits: number;
  savedPosts: Post[];
};

export type GetPostlikesRes = {
  nbHits: number;
  likes: [{ _id: string; username: string; profilePicture: string }];
};

export type GetPostsRes = {
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  posts: Post[];
};

export type GetUserPostsRes = {
  currentPage: number;
  nextPage: number;
  totalPosts: number;
  posts: Post[];
};

export type GetUserPostsArg = {
  userId: string;
  page: number;
};
// PROFILE
export type Profile = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  numFollowing: number;
  numFollowers: number;
  isVerified: true;
  private: true;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = Profile & {
  following: "follow" | "following" | "request sent";
};

export type UpdateProfileArgs = {
  profilePicture?: string;
  coverPhoto?: string;
  username?: string;
  bio?: string;
};

export type UpdatePasswordArgs = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};

export type ChangeProfilePrivacyArg = {
  privacy: boolean;
};

// UPLOAD
export type UploadRes = {
  msg: string;
  url: string;
};

//USERS
export type UserInfo = {
  _id: string;
  username: string;
  profilePicture: string;
  currentUserFollowing: "following" | "follow" | "request sent";
};

export type GetFollowingRes = {
  nbHits: number;
  following: UserInfo[];
};
export type GetFollowersRes = {
  nbHits: number;
  followers: UserInfo[];
};

export type FolUnfArgs = {
  userId: string;
};

export type GetFollowRequestsRes = {
  followingRequests: Omit<UserInfo, "currentUserFollowing">;
};
// COMMENTS
export type Reply = {
  _id: string;
  user: Omit<UserInfo, "currentUserFollowing">;
  comment: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  _id: string;
  user: Omit<UserInfo, "currentUserFollowing">;
  post: string;
  text: string;
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
  myPost: boolean;
  myComment: boolean;
};

export type CreateCommentArgs = {
  text: string;
  postId: string;
};

export type EditCommentType = {
  postId: string;
  text: string;
};

export type GetPostCommentsRes = {
  nbHits: 2;
  comments: Comment[];
};

export type CreateReplyRes = {
  msg: string;
  reply: Reply;
};
export type CreateReplyArgs = {
  text: string;
  commentId: string;
};

export type DeleteReplyArgs = {
  commentId: string;
  replyId: string;
};
