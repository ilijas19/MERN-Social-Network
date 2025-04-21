import CustomError from "../errors/error-index.js";
import { verifyJwt, attachCookiesToResponse } from "../utils/jwt.js";
import Token from "../models/Token.js";

export const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new CustomError.UnauthorizedError(
      "Not Authorized To Access This Route"
    );
  }
  next();
};

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (!accessToken && !refreshToken) {
      throw new CustomError.UnauthenticatedError("Authentication Failed");
    }

    if (accessToken) {
      const decoded = verifyJwt(accessToken);
      req.user = decoded.user;
      return next();
    }
    if (refreshToken) {
      const decoded = verifyJwt(refreshToken);
      const token = await Token.findOne({
        user: decoded.user.userId,
        refreshToken: decoded.refreshToken,
      });
      if (!token || !token.isValid) {
        throw new CustomError.UnauthenticatedError("Authentication Failed");
      }
      attachCookiesToResponse({
        res,
        user: decoded.user,
        refreshToken: token.refreshToken,
      });
      req.user = decoded.user;
      return next();
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
};
