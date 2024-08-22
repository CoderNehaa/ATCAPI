// authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import generateToken from "./jwt-token.middleware";
import UserController from "../controllers/user.controller";

// Helper function to handle token validation
const validateToken = async (token: string): Promise<any> => {
  try {
    // Check if token is valid
    const payload = jwt.verify(token, "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb") as {
      userId: number;
      email: string;
    };

    const data = await UserModel.getbyId(payload.userId);

    if (!data.result) {
      return { result: false, message: data.message };
    } else {
      const newAccessToken = generateToken(payload.userId, payload.email, "1h");
      const newRefreshToken = generateToken(
        payload.userId,
        payload.email,
        "7d"
      );
      return { result: true, user: data.user, newAccessToken, newRefreshToken };
    }
  } catch (e) {
    console.error("Error while validating token:", e);
    return { result: false, message: "Internal Server Error" };
  }
};

// Token Expiry Handling Middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      // Validate access token first
      const accessTokenResponse = await validateToken(accessToken);
      if (accessTokenResponse.result) {
        req.user = accessTokenResponse.user;
        res.cookie("accessToken", accessTokenResponse.newAccessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 60 * 60 * 1000,
          sameSite: "none",
        });
        res.cookie("refreshToken", accessTokenResponse.newRefreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });
        return next();
      }
    }

    if (refreshToken) {
    const refreshTokenResponse = await validateToken(refreshToken);
      if (refreshTokenResponse.result) {
        req.user = refreshTokenResponse.user;
        res.cookie("accessToken", refreshTokenResponse.newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshTokenResponse.newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return next();
      } else {
        const userController = new UserController();
        return userController.logOut(req, res);
      }
    }
    return res.status(200).send({ result: false, message: "Invalid token" });
  } catch (e) {
    console.error("Internal server error in auth middleware:", e);
    return res
      .status(200)
      .send({ result: false, message: "Internal server error" });
  }
};
