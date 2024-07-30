import jwt from "jsonwebtoken";
import passport from "passport";
import { Request, Response, NextFunction, Router } from "express";

import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/jwtAuth.middleware";
import { validationMiddleware } from "../middlewares/formValidation.middleware";

const userRouter = Router();
const userController = new UserController();
const jwtSecret = process.env.JWT_SECRET || "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb";

userRouter.get("/all", authMiddleware, userController.getAllUsers);
userRouter.post("/add", validationMiddleware, userController.addNewUser);
userRouter.put("/update/:userId", authMiddleware, userController.updateUser);

userRouter.delete("/remove/:userId", authMiddleware, userController.deleteUser);

userRouter.get("/:userId", authMiddleware, userController.getUserByUserId);

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


//passport implementation
const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "1h",
  });
};

// Form-based authentication - passport-local
userRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: Error, user: any, info: any) => {
      if (err) return next(err);
      if (!user)
        return res.status(404).send({ result: false, message: info.message });

      req.logIn(user, (err) => {
        if (err) return next(err);
        const token = generateToken(user);
        return res.status(200).send({
          result: true,
          message: "Logged in successfully",
          data: user,
          token,
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
  passport.authenticate("google", { failureMessage: "Error occurred" }),
  (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    req.logIn(user, (err) => {
      if (err) return next(err);
      const token = generateToken(user);
      return res.status(200).send({
        result: true,
        message: "Logged in successfully",
        data: user,
        token,
      });
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
      const token = generateToken(user);
      return res.status(200).send({
        result: true,
        message: "Logged in successfully",
        data: user,
        token,
      });
    });
  }
);

export default userRouter;
