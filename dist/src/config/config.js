"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getConfig = () => {
    const { NODE_ENV, DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, JWT_SECRET, GOOGLE_CLIENTID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FACEBOOK_APPID, FACEBOOK_SECRET, FACEBOOK_CALLBACK_URL, FRONT_END_DOMAIN, SESSION_SECRET } = process.env;
    if (!NODE_ENV ||
        !DB_CONNECTION ||
        !DB_HOST ||
        !DB_PORT ||
        !DB_DATABASE ||
        !DB_USERNAME ||
        !DB_USERNAME ||
        !DB_PASSWORD ||
        !GOOGLE_CLIENTID ||
        !GOOGLE_CLIENT_SECRET ||
        !GOOGLE_CALLBACK_URL ||
        !FACEBOOK_APPID ||
        !FACEBOOK_SECRET ||
        !FACEBOOK_CALLBACK_URL ||
        !FRONT_END_DOMAIN ||
        !JWT_SECRET ||
        !SESSION_SECRET) {
        throw new Error("Missing required environment variables");
    }
    return {
        NODE_ENV,
        DB_CONNECTION,
        DB_HOST,
        DB_PORT,
        DB_DATABASE,
        DB_USERNAME,
        DB_PASSWORD,
        JWT_SECRET,
        GOOGLE_CLIENTID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL,
        FACEBOOK_APPID,
        FACEBOOK_SECRET,
        FACEBOOK_CALLBACK_URL,
        FRONT_END_DOMAIN,
        SESSION_SECRET
    };
};
exports.config = getConfig();
