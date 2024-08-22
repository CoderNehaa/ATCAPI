"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateToken = (userId, email, expiryTime) => {
    return jsonwebtoken_1.default.sign({ userId: userId, email: email }, config_1.config.JWT_SECRET, {
        expiresIn: expiryTime,
    });
};
exports.default = generateToken;
