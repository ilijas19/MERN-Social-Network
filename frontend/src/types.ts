export type MessageRes = {
  msg: string;
};

export type CurrentUser = {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

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
