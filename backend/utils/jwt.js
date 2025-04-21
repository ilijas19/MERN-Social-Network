import jwt from "jsonwebtoken";

const createJwt = ({ payload, expiresIn }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJwt({ payload: { user }, expiresIn: "1h" });
  const refreshTokenTokenJwt = createJwt({
    payload: { user, refreshToken },
    expiresIn: "3d",
  });

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60,
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshTokenTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 3,
    sameSite: "strict",
  });
};
