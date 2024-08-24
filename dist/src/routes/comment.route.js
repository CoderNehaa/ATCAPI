"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
const articleRouter = (0, express_1.default)();
const commentController = new comment_controller_1.default();
articleRouter.get('/:articleId', auth_middleware_1.authMiddleware, commentController.getCommentsByArticleId);
articleRouter.post('/add', auth_middleware_1.authMiddleware, commentController.addComment);
articleRouter.put('/update/:commentId', auth_middleware_1.authMiddleware, commentController.editComment);
articleRouter.delete('/remove/:commentId', auth_middleware_1.authMiddleware, commentController.removeComment);
exports.default = articleRouter;
