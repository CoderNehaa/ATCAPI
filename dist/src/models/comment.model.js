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
exports.CommentModel = void 0;
const db_connect_1 = __importDefault(require("../config/db.connect"));
class CommentModel {
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [comment] = yield db_connect_1.default.query(`SELECT * FROM comments WHERE id = ${id}`);
            return comment[0];
        });
    }
    static create(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_connect_1.default.query(`INSERT INTO comments (userId, articleId, text, commentDate) VALUE(?, ?, ?, ?)`, [comment.userId, comment.articleId, comment.text, comment.commentDate]);
        });
    }
    static update(updatedComment) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static delete(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_connect_1.default.query(`DELETE FROM comments WHERE id = ${commentId}`);
        });
    }
    static getByArticleId(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [comments] = yield db_connect_1.default.query(`SELECT * FROM comments articleId = ${articleId}`);
            return comments;
        });
    }
}
exports.CommentModel = CommentModel;
