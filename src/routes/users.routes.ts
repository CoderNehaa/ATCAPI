import passport from "passport";
import { Request, Response, NextFunction, Router } from "express";

import { config } from "../config/config";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/formValidation.middleware";
import generateToken from "../middlewares/jwt-token.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/getvaliduser", authMiddleware, userController.sendValidUser);
userRouter.get("/all", authMiddleware, userController.getAllUsers);
userRouter.post("/add", validationMiddleware, userController.signup);
userRouter.put("/update/:userId", authMiddleware, userController.updateUser);

userRouter.delete("/remove/:userId", authMiddleware, userController.deleteUser);

userRouter.get("/get/:userId", authMiddleware, userController.getUserByUserId);

// Reset password
userRouter.patch(
  "/resetPassword",
  authMiddleware,
  validationMiddleware,
  userController.resetPassword
);

// Send verification link
userRouter.post(
  "/sendVerificationLink",
  authMiddleware,
  userController.sendVerificationLink
);

// Form-based authentication - passport-local
userRouter.post(
  "/login", 
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: Error, user: any, info: any) => {
      if (err) return next(err);
      if (!user)
        return res.status(200).send({ result: false, message: info.message });

      req.logIn(user, (err) => {
        if (err) return next(err);
        //generate access token
        const accessToken = generateToken(user.id, user.email, "1h");

        //generate refresh token
        const refreshToken = generateToken(user.id, user.email, "7d");

        res.setHeader("Access-Control-Allow-Credentials", "true");

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false, //Marks the cookie to be used with HTTPS only.
          maxAge: 60 * 60 * 1000,
          sameSite: "none",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });

        return res.status(200).send({
          result: true,
          message: "Logged in successfully",
          data: user,
        });
      });
    })(req, res, next);
  }
);

// Google authentication
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google authentication - handle callback
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    req.logIn(user, (err) => {
      if (err) return next(err);
      //generate access token
      const accessToken = generateToken(user.id, user.email, "1h");

      //generate refresh token
      const refreshToken = generateToken(user.id, user.email, "7d");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, //Marks the cookie to be used with HTTPS only.
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      });

      //send accessToken in response
      res.redirect(`${config.FRONT_END_DOMAIN}/`);
    });
  }
);

// Facebook authentication
userRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

// Facebook authentication - handle callback
userRouter.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    req.logIn(user, (err) => {
      if (err) return next(err);
      //generate access token
      const accessToken = generateToken(user.id, user.email, "1h");

      //generate refresh token
      const refreshToken = generateToken(user.id, user.email, "7d");

      res.setHeader("Access-Control-Allow-Credentials", "true");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, //Marks the cookie to be used with HTTPS only.
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      });

      //send accessToken in response
      res.redirect(`${config.FRONT_END_DOMAIN}/`);
    });
  }
);

userRouter.get('/logout', userController.logOut);

export default userRouter;
