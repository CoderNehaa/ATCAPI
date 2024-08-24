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
exports.UserModel = exports.Provider = void 0;
const db_connect_1 = __importDefault(require("../config/db.connect"));
var Provider;
(function (Provider) {
    Provider["password"] = "password";
    Provider["google"] = "google";
    Provider["facebook"] = "facebook";
})(Provider || (exports.Provider = Provider = {}));
var SubscriptionType;
(function (SubscriptionType) {
    SubscriptionType["free"] = "free";
    SubscriptionType["paid"] = "paid";
})(SubscriptionType || (SubscriptionType = {}));
class UserModel {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [users] = yield db_connect_1.default.query(`SELECT * FROM users`);
            return users;
        });
    }
    static getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield db_connect_1.default.query("SELECT * FROM users where email = ?", [email]);
            if (data.length > 0) {
                return {
                    result: true,
                    user: data[0],
                };
            }
            else {
                return {
                    result: false,
                    message: "No account found with this email",
                };
            }
        });
    }
    static getbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return;
            }
            const [data] = yield db_connect_1.default.query("SELECT * FROM users where id = ?", [id]);
            if (data.length > 0) {
                return {
                    result: true,
                    user: data[0],
                };
            }
            else {
                return {
                    result: false,
                    message: "No account found with this credentials",
                };
            }
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_connect_1.default.query(`INSERT INTO 
      users (email, provider, socialId, username, bio, profilePicture, isVerified, password) 
      VALUE(?, ?, ?, ?, ?, ?, ?, ?)`, [
                user.email,
                user.provider,
                user.socialId,
                user.username,
                user.bio,
                user.profilePicture,
                user.isVerified,
                user.password,
            ]);
            const newUserId = result[0].insertId;
            const newUser = yield this.getbyId(newUserId);
            return newUser.user;
        });
    }
    static delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            yield db_connect_1.default.query(`DELETE FROM users where id = ${userId}`);
        });
    }
    static update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      UPDATE users SET bio = ? , profilePicture = ?, username = ? WHERE id = ?`;
            const result = yield db_connect_1.default.query(query, [user.bio, user.profilePicture, user.username, user.id]);
        });
    }
}
exports.UserModel = UserModel;
