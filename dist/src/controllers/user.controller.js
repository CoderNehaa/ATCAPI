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
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_password_1 = __importDefault(require("generate-password"));
const email_middleware_1 = __importDefault(require("../middlewares/email.middleware"));
const user_model_1 = require("../models/user.model");
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.UserModel.getAll();
                const succResponse = {
                    result: true,
                    message: "Data fetched successfully",
                    data: users,
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: true,
                    message: "Error occurred while fetching users list",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errResponse = {
                result: false,
                message: "",
            };
            try {
                const { email, password, username } = req.body;
                if (!email || !password || !username) {
                    errResponse.message =
                        "Username, email and password fields are mandatory";
                    return res.status(400).send(errResponse);
                }
                let emailExist = yield user_model_1.UserModel.getByEmail(email);
                if (emailExist.result) {
                    errResponse.message = "Account with this email already exists";
                    return res.status(200).send(errResponse);
                }
                // hash password here
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = {
                    email,
                    password: hashedPassword,
                    username,
                    provider: user_model_1.Provider.password,
                    isVerified: false,
                    socialId: "",
                    profilePicture: "",
                    bio: "Hey there! I am ATCian"
                };
                const newUser = yield user_model_1.UserModel.create(user);
                return res.status(200).send({
                    result: true,
                    message: "Account created successfully",
                    data: user,
                });
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while creating user",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            try {
                const userId = parseInt(req.params.userId);
                const userExist = yield user_model_1.UserModel.getbyId(userId);
                if (!userExist.result) {
                    const errResponse = {
                        result: false,
                        message: "User not found",
                    };
                    return res.status(404).send(errResponse);
                }
                //delete from db
                yield user_model_1.UserModel.delete(userId);
                const succResponse = {
                    result: true,
                    message: "User account deleted successfully",
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while deleting user",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    getUserByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errResponse = {
                result: false,
                message: "",
            };
            try {
                const userId = parseInt(req.params.userId);
                if (!userId) {
                    errResponse.message = "Invalid user id";
                    return errResponse;
                }
                const userRes = yield user_model_1.UserModel.getbyId(userId);
                if (userRes.result) {
                    const succResponse = {
                        result: true,
                        data: userRes.user,
                    };
                    return res.status(200).send(succResponse);
                }
                else {
                    return res.status(404).send(userRes);
                }
            }
            catch (e) {
                console.log(e);
                errResponse.message = "Error occurred while getting user";
                return res.status(200).send(errResponse);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = Object.assign(Object.assign({}, req.user), { bio: req.body.bio, profilePicture: req.body.profilePicture, username: req.body.username });
                yield user_model_1.UserModel.update(updatedUser);
                const succResponse = {
                    result: true,
                    message: "User updated successfully",
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log("Error updatng user : ", e);
                const errResponse = {
                    result: false,
                    message: "Failed to update! Try later",
                };
                return res.status(200).send(errResponse);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = { data: "pedning" };
                if (!user) {
                    const errResponse = {
                        result: false,
                        message: "User not found",
                    };
                    return res.status(404).send(errResponse);
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                //update password in db here
                const succResponse = {
                    result: true,
                    message: "Password changed successfully",
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while changing password",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    sendVerificationLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExist = { data: "pending" };
                if (userExist) {
                    const randomPassword = generate_password_1.default.generate({
                        length: 10,
                        uppercase: false,
                    });
                    const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
                    //update password in db here
                    const mailSent = yield (0, email_middleware_1.default)(email, "Pending", randomPassword);
                    if (mailSent) {
                        const succResponse = {
                            result: true,
                            message: "Temporary password sent on this email address. Login again",
                        };
                        return res.status(200).send(succResponse);
                    }
                }
                else {
                    const errResponse = {
                        result: true,
                        message: "No account found associated with this email",
                    };
                    return res.status(404).send(errResponse);
                }
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: true,
                    message: "Interal server error",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    sendValidUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).send({ result: true, user: req.user });
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.logout((err) => {
                    if (err) {
                        return res.status(500).send({ result: false, message: "Logout failed" });
                    }
                    // Clear the cookies by setting them with an expired date
                    res.cookie("accessToken", "", {
                        httpOnly: true,
                        secure: false,
                        expires: new Date(0),
                        maxAge: 0,
                        sameSite: "none"
                    });
                    res.cookie("refreshToken", "", {
                        httpOnly: true,
                        secure: false,
                        expires: new Date(0),
                        maxAge: 0,
                        sameSite: "none"
                    });
                    const resObj = {
                        result: false, //for validate user api, if user is not deleted, logout will be called
                        message: "Logged out successfully"
                    };
                    return res.status(200).send(resObj);
                });
            }
            catch (e) {
                console.log(e);
                return res.status(200).send({ result: false, message: "Failed to log out! Please try again." });
            }
        });
    }
}
exports.default = UserController;
