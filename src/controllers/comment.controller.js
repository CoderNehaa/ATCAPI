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
Object.defineProperty(exports, "__esModule", { value: true });
const comment_model_1 = require("../models/comment.model");
class CommentController {
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, articleId, text, commentDate } = req.body;
            const newComment = { userId, articleId, text, commentDate };
            yield comment_model_1.CommentModel.create(newComment);
            try {
                const succResponse = {
                    result: false,
                    message: 'Comment added successfully',
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: 'Error occurred while adding comment',
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    //below function pending
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId);
                const { text } = req.body;
                const oldComment = yield comment_model_1.CommentModel.getById(commentId);
                oldComment.text = text;
                yield comment_model_1.CommentModel.update(oldComment);
                const succResponse = {
                    result: false,
                    message: 'Comment updated successfully'
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: 'Error occurred while editing comment',
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    removeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId);
                const commentExist = yield comment_model_1.CommentModel.getById(commentId);
                if (!commentExist) {
                    const errResponse = {
                        result: false,
                        message: 'Comment not found',
                    };
                    return res.status(404).send(errResponse);
                }
                yield comment_model_1.CommentModel.delete(commentId);
                const succResponse = {
                    result: true,
                    message: 'Comment deleted successfully'
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: 'Error occurred while removing comment',
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    getCommentsByArticleId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = parseInt(req.params.articleId);
                const comments = yield comment_model_1.CommentModel.getByArticleId(articleId);
                const succResponse = {
                    result: false,
                    message: 'Comments fetched successfully',
                    data: comments,
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: 'Error occurred while getting comments by article id',
                };
                return res.status(500).send(errResponse);
            }
        });
    }
}
exports.default = CommentController;
