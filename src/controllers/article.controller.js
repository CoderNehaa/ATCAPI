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
const article_model_1 = require("../models/article.model");
const db_connect_1 = __importDefault(require("../config/db.connect"));
const user_model_1 = require("../models/user.model");
class ArticleController {
    getAllArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articles = yield article_model_1.ArticleModel.getAll();
                const responseObj = {
                    result: true,
                    message: "All articles fetched successfully",
                    data: articles,
                };
                return res.status(200).send(responseObj);
            }
            catch (e) {
                console.log("Error occurred while getting all articles : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while getting all articles",
                };
                return res.status(500).send(responseObj);
            }
        });
    }
    getTrendingArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const articles = yield article_model_1.ArticleModel.getTrending(userId ? userId : 0);
                const responseObj = {
                    result: true,
                    message: "Trending articles fetched successfully",
                    data: articles,
                };
                return res.status(200).send(responseObj);
            }
            catch (e) {
                console.log("Error occurred while getting trending articles : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while getting trending articles",
                };
                return res.status(500).send(responseObj);
            }
        });
    }
    getArticlesByKeywords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const keywordId = parseInt(req.params.keywordId);
                const articles = yield article_model_1.ArticleModel.getByKeyword(keywordId, user ? user.id : 0);
                const responseObj = {
                    result: true,
                    data: articles
                };
                return res.status(200).send(responseObj);
            }
            catch (e) {
                console.log("Error occurred while getting articles filtered by category : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while getting articles filtered by category",
                };
                return res.status(200).send(responseObj);
            }
        });
    }
    getUserFavoriteArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return;
                }
                const articles = yield article_model_1.ArticleModel.getFavorites(user.id);
                const successRes = {
                    result: true,
                    data: articles
                };
                return res.status(200).send(successRes);
            }
            catch (e) {
                console.log(e);
                return res.status(200).send({
                    result: false,
                    message: "Could not fetch favorite articles! Try later"
                });
            }
        });
    }
    getArticleByArticleId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = parseInt(req.params.articleId);
                if (isNaN(articleId)) {
                    return res.status(400).send({
                        result: false,
                        message: "Invalid Article ID"
                    });
                }
                const article = yield article_model_1.ArticleModel.getById(articleId);
                if (article) {
                    const responseObj = {
                        result: true,
                        message: "Article fetched successfully",
                        data: article,
                    };
                    return res.status(200).send(responseObj);
                }
                const responseObj = {
                    result: false,
                    message: "Article not found",
                };
                return res.status(404).send(responseObj);
            }
            catch (e) {
                console.log("Error occurred while getting article by article id : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while getting article by article id",
                };
                return res.status(500).send(responseObj);
            }
        });
    }
    getArticlesByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const [authorArticles] = yield db_connect_1.default.query(`SELECT * FROM articles where userId = ${userId}`);
                if (authorArticles) {
                    const responseObj = {
                        result: true,
                        message: "Data fetched successfully",
                        data: authorArticles,
                    };
                    return res.status(200).send(responseObj);
                }
                const responseObj = {
                    result: false,
                    message: "Article written by this author not found",
                };
                return res.status(404).send(responseObj);
            }
            catch (e) {
                console.log("Error occurred while getting article by user/autor id : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while getting article by author id",
                };
                return res.status(500).send(responseObj);
            }
        });
    }
    addNewArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = req.body;
                //take care of duplicate title of article
                // Validate required fields
                if (!article.title || !article.userId || !article.content) {
                    return res.status(400).send({
                        result: false,
                        message: "Title, userId, and content are required fields.",
                    });
                }
                //save new article to db
                yield article_model_1.ArticleModel.create(article);
                const succResponse = {
                    result: true,
                    message: "Article added successfully",
                };
                return res.status(201).send(succResponse);
            }
            catch (e) {
                console.log("Error occurred while adding new article : ", e);
                const responseObj = {
                    result: false,
                    message: "Error occurred while adding new article",
                };
                return res.status(500).send(responseObj);
            }
        });
    }
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { articleId } = req.params;
                const updatedArticle = req.body;
                const succResponse = {
                    result: true,
                    message: "Article updated successfully",
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log("Error while getting articles by user id : ", e);
                const erResponse = {
                    result: false,
                    message: "Error occurred while updating article",
                };
                return res.status(500).send(erResponse);
            }
        });
    }
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = parseInt(req.params.articleId);
                if (isNaN(articleId)) {
                    const errResponse = {
                        result: false,
                        message: "Invalid Article ID",
                    };
                    return res.status(404).send(errResponse);
                }
                const articleExists = yield article_model_1.ArticleModel.exists(articleId);
                if (!articleExists) {
                    const errResponse = {
                        result: false,
                        message: "Article not found",
                    };
                    return res.status(404).send(errResponse);
                }
                yield article_model_1.ArticleModel.delete(articleId);
                const succResponse = {
                    result: true,
                    message: "Article deleted successfully",
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log("Error while deleting article : ", e);
                const erResponse = {
                    result: false,
                    message: "Error occurred while deleting article",
                };
                return res.status(500).send(erResponse);
            }
        });
    }
    addKeywordsToArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { articleId, keywordIds, } = req.body;
                if (!articleId || !Array.isArray(keywordIds) || keywordIds.length === 0) {
                    const errResponse = {
                        result: false,
                        message: "Invalid input. Please provide a valid article ID and an array of keyword IDs.",
                    };
                    return res.status(400).send(errResponse);
                }
                yield article_model_1.ArticleModel.addKeywords(articleId, keywordIds);
                const succResponse = {
                    result: true,
                    message: "Keywords added to article successfully",
                };
                return res.status(500).send("done");
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Internal server error",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    addToFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const articleId = parseInt(req.params.articleId);
                yield article_model_1.ArticleModel.addFavorite(user.id, articleId);
                return res.status(200).send({
                    result: true,
                    message: "Article added to Bookmarks."
                });
            }
            catch (e) {
                console.log(e);
                return res.status(200).send({
                    result: false,
                    message: "Failed to add article to Bookmarks! Try later."
                });
            }
        });
    }
    removeFromFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const articleId = parseInt(req.params.articleId);
                yield article_model_1.ArticleModel.removeFavorite(user.id, articleId);
                return res.status(200).send({
                    result: true,
                    message: "Article removed from Bookmarks."
                });
            }
            catch (e) {
                console.log(e);
                return res.status(200).send({
                    result: false,
                    message: "Failed to remove articles from Bookmarks! Try later."
                });
            }
        });
    }
    toggleLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = parseInt(req.params.articleId);
                const userId = parseInt(req.params.userId);
                let responseObj = {
                    result: false,
                    message: "",
                };
                //check if user exists
                const userExist = yield user_model_1.UserModel.getbyId(userId);
                if (!userExist.result) {
                    responseObj.message = "User not found";
                    return res.status(404).send(responseObj);
                }
                //check if article exists
                const articleExist = yield article_model_1.ArticleModel.exists(articleId);
                if (!articleExist) {
                    responseObj.message = "Article not found";
                    return res.status(404).send(responseObj);
                }
                //check if article is already liked or not
                const isArticleLiked = yield article_model_1.ArticleModel.isLiked(articleId, userId);
                if (isArticleLiked) {
                    //remove like
                    yield article_model_1.ArticleModel.removeLike(articleId, userId);
                    responseObj.result = true;
                    responseObj.message = "Like removed successfully";
                }
                else {
                    //add like
                    yield article_model_1.ArticleModel.addLike(articleId, userId);
                    responseObj.result = true;
                    responseObj.message = "Like added successfully";
                }
                return res.status(200).send(responseObj);
            }
            catch (e) {
                console.log("Error in toggle like ", e);
                const errResponse = {
                    result: false,
                    message: "Internal server error",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
}
exports.default = ArticleController;
