"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const articleRouter = (0, express_1.default)();
const articleController = new article_controller_1.default();
articleRouter.get('/all', articleController.getAllArticles);
articleRouter.get('/trending/:userId', articleController.getTrendingArticles);
articleRouter.get('/details/:articleId', articleController.getArticleByArticleId);
articleRouter.get('/author/:userId', articleController.getArticlesByUserId);
articleRouter.post('/add', auth_middleware_1.authMiddleware, articleController.addNewArticle);
articleRouter.put('/update/:articleId', auth_middleware_1.authMiddleware, articleController.updateArticle);
articleRouter.delete('/remove/:articleId', auth_middleware_1.authMiddleware, articleController.deleteArticle);
// like
articleRouter.post('/likes/:articleId/:userId', auth_middleware_1.authMiddleware, articleController.toggleLikes);
//keywords
articleRouter.post('/add-keywords', auth_middleware_1.authMiddleware, articleController.addKeywordsToArticle);
articleRouter.get('/keyword/:keywordId', articleController.getArticlesByKeywords);
//favorites
articleRouter.get('/favorites', auth_middleware_1.authMiddleware, articleController.getUserFavoriteArticles);
articleRouter.post('/favorites/add/:articleId', auth_middleware_1.authMiddleware, articleController.addToFavorites);
articleRouter.delete('/favorites/remove/:articleId', auth_middleware_1.authMiddleware, articleController.addToFavorites);
exports.default = articleRouter;
