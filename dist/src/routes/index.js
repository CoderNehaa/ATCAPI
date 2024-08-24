"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./users.routes"));
const article_routes_1 = __importDefault(require("./article.routes"));
const comment_route_1 = __importDefault(require("./comment.route"));
const keyword_routes_1 = __importDefault(require("./keyword.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const router = express_1.default.Router();
router.use('/users', users_routes_1.default);
router.use('/articles', article_routes_1.default);
router.use('/comments', comment_route_1.default);
router.use('/keywords', keyword_routes_1.default);
router.use('/chats', chat_routes_1.default);
router.get('/', (req, res) => {
    return res.send("Browse API on http://localhost:3200/api/");
});
exports.default = router;
