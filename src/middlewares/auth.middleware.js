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
exports.authMiddleware = void 0;
// authMiddleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_token_middleware_1 = __importDefault(require("./jwt-token.middleware"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
// Helper function to handle token validation
const validateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if token is valid
        const payload = jsonwebtoken_1.default.verify(token, "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb");
        const data = yield user_model_1.UserModel.getbyId(payload.userId);
        if (!data.result) {
            return { result: false, message: data.message };
        }
        else {
            const newAccessToken = (0, jwt_token_middleware_1.default)(payload.userId, payload.email, "1h");
            const newRefreshToken = (0, jwt_token_middleware_1.default)(payload.userId, payload.email, "7d");
            return { result: true, user: data.user, newAccessToken, newRefreshToken };
        }
    }
    catch (e) {
        console.error("Error while validating token:", e);
        return { result: false, message: "Internal Server Error" };
    }
});
// Token Expiry Handling Middleware
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (accessToken) {
            // Validate access token first
            const accessTokenResponse = yield validateToken(accessToken);
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
            const refreshTokenResponse = yield validateToken(refreshToken);
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
            }
            else {
                const userController = new user_controller_1.default();
                return userController.logOut(req, res);
            }
        }
        return res.status(200).send({ result: false, message: "Invalid token" });
    }
    catch (e) {
        console.error("Internal server error in auth middleware:", e);
        return res
            .status(200)
            .send({ result: false, message: "Internal server error" });
    }
});
exports.authMiddleware = authMiddleware;
