import User from "../models/User.js";
import Token from "../models/Token.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { attachCookiesToResponse } from "../utils/jwt.js";
import createTokenUser from "../utils/createTokenUser.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new CustomError.BadRequestError("All Credentials Must Be Provided");
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new CustomError.BadRequestError("Email Already In Use");
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new CustomError.BadRequestError("Username Already In Use");
  }

  await User.create({ username, email, password });
  res.status(StatusCodes.OK).json({ msg: "Account Created Successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All Credentials Must Be Provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    attachCookiesToResponse({
      res,
      user: tokenUser,
      refreshToken: existingToken.refreshToken,
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfully", tokenUser });
  }

  const refreshToken = crypto.randomBytes(64).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({
    user: user._id,
    refreshToken,
    ip,
    userAgent,
  });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfully", tokenUser });
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await Token.findOneAndDelete({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

export const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};
