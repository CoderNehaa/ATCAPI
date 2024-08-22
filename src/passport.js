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
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./models/user.model");
const config_1 = require("./config/config");
const comparePassword = (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
//local strategy for form based auth
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield user_model_1.UserModel.getByEmail(email);
        if (userFound.result && (yield comparePassword(password, userFound.user.password))) {
            return done(null, userFound.user);
        }
        else {
            return done(null, false, { message: "Invalid credentials" });
        }
    }
    catch (e) {
        console.error(e);
        return done(e, false, { message: "Failed to login! Please try again" });
    }
})));
//google strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.config.GOOGLE_CLIENTID,
    clientSecret: config_1.config.GOOGLE_CLIENT_SECRET,
    callbackURL: config_1.config.GOOGLE_CALLBACK_URL,
}, function (accessToken, refreshtoken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = profile.emails ? profile.emails[0].value : "";
            if (!email) {
                return done(null, false, { message: "No email found in profile" });
            }
            let userExist = yield user_model_1.UserModel.getByEmail(email);
            if (userExist.result) {
                return done(null, userExist.user);
            }
            else {
                const userDetails = {
                    email: email,
                    provider: user_model_1.Provider.google,
                    socialId: profile.id,
                    username: profile.displayName,
                    profilePicture: profile.photos ? profile.photos[0].value : "",
                    isVerified: profile.emails ? profile.emails[0].verified : false,
                    password: "",
                };
                const newUser = yield user_model_1.UserModel.create(userDetails);
                return done(null, newUser);
            }
        }
        catch (error) {
            console.error(error);
            return done(error, false);
        }
    });
}));
//facebook strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: config_1.config.FACEBOOK_APPID,
    clientSecret: config_1.config.FACEBOOK_SECRET,
    callbackURL: config_1.config.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "displayName", "emails", "profileUrl"],
}, function (accessToken, refreshtoken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
            if (!email) {
                return done(null, false, { message: "No email found in profile" });
            }
            let userExist = yield user_model_1.UserModel.getByEmail(email);
            if (userExist.result) {
                return done(null, userExist.user);
            }
            else {
                const fbUser = {
                    username: profile.displayName,
                    socialId: profile.id,
                    profilePicture: profile.profileUrl || "",
                    email: email,
                    provider: user_model_1.Provider.facebook,
                    isVerified: true,
                    password: "",
                };
                const newUser = yield user_model_1.UserModel.create(fbUser);
                return done(null, newUser);
            }
        }
        catch (error) {
            console.error(error);
            return done(error, false);
        }
    });
}));
passport_1.default.serializeUser(function (user, done) {
    return done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.UserModel.getbyId(id);
        if (user) {
            done(null, user);
        }
        else {
            done(new Error("User not found"), null);
        }
    }
    catch (error) {
        done(error, null);
    }
}));
