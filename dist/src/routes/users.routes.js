"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const config_1 = require("../config/config");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const formValidation_middleware_1 = require("../middlewares/formValidation.middleware");
const jwt_token_middleware_1 = __importDefault(require("../middlewares/jwt-token.middleware"));
const userRouter = (0, express_1.Router)();
const userController = new user_controller_1.default();
userRouter.get("/getvaliduser", auth_middleware_1.authMiddleware, userController.sendValidUser);
userRouter.get("/all", auth_middleware_1.authMiddleware, userController.getAllUsers);
userRouter.post("/add", formValidation_middleware_1.validationMiddleware, userController.signup);
userRouter.put("/update/:userId", auth_middleware_1.authMiddleware, userController.updateUser);
userRouter.delete("/remove/:userId", auth_middleware_1.authMiddleware, userController.deleteUser);
userRouter.get("/get/:userId", auth_middleware_1.authMiddleware, userController.getUserByUserId);
// Reset password
userRouter.patch("/resetPassword", auth_middleware_1.authMiddleware, formValidation_middleware_1.validationMiddleware, userController.resetPassword);
// Send verification link
userRouter.post("/sendVerificationLink", auth_middleware_1.authMiddleware, userController.sendVerificationLink);
// Form-based authentication - passport-local
userRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(err);
        if (!user)
            return res.status(200).send({ result: false, message: info.message });
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            //generate access token
            const accessToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "1h");
            //generate refresh token
            const refreshToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "7d");
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
    }))(req, res, next);
}));
// Google authentication
userRouter.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
}));
// Google authentication - handle callback
userRouter.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res, next) => {
    const user = req.user;
    req.logIn(user, (err) => {
        if (err)
            return next(err);
        //generate access token
        const accessToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "1h");
        //generate refresh token
        const refreshToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "7d");
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
        res.redirect(`${config_1.config.FRONT_END_DOMAIN}/`);
    });
});
// Facebook authentication
userRouter.get("/auth/facebook", passport_1.default.authenticate("facebook", { scope: ["public_profile", "email"] }));
// Facebook authentication - handle callback
userRouter.get("/auth/facebook/callback", passport_1.default.authenticate("facebook"), (req, res, next) => {
    const user = req.user;
    req.logIn(user, (err) => {
        if (err)
            return next(err);
        //generate access token
        const accessToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "1h");
        //generate refresh token
        const refreshToken = (0, jwt_token_middleware_1.default)(user.id, user.email, "7d");
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
        res.redirect(`${config_1.config.FRONT_END_DOMAIN}/`);
    });
});
userRouter.get('/logout', userController.logOut);
exports.default = userRouter;
