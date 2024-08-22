"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const keyword_controller_1 = require("../controllers/keyword.controller");
const keywordRouter = (0, express_1.default)();
const keywordController = new keyword_controller_1.KeywordController();
keywordRouter.get('/all', keywordController.getAllKeywords);
keywordRouter.post('/add', auth_middleware_1.authMiddleware, keywordController.addKeyword);
keywordRouter.delete('/remove/:keywordId', auth_middleware_1.authMiddleware, keywordController.deleteKeyword);
exports.default = keywordRouter;
