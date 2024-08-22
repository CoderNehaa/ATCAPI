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
exports.ArticleModel = void 0;
const db_connect_1 = __importDefault(require("../config/db.connect"));
var Privacy;
(function (Privacy) {
    Privacy[Privacy["private"] = 0] = "private";
    Privacy[Privacy["public"] = 1] = "public";
})(Privacy || (Privacy = {}));
var Language;
(function (Language) {
    Language[Language["hindi"] = 0] = "hindi";
    Language[Language["english"] = 1] = "english";
})(Language || (Language = {}));
class ArticleModel {
    static create(article) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_connect_1.default.query(`INSERT INTO 
      articles(userId, title, description, content, articleImage, privacy, language)
      VALUE(?, ?, ?, ?, ?, ?, ?)
      `, [
                article.userId,
                article.title,
                article.description,
                article.content,
                article.articleImage,
                article.privacy,
                article.language,
            ]);
            const newArticleId = result[0].insertId;
            if (article.keywords && article.keywords.length) {
                yield this.addKeywords(newArticleId, article.keywords);
            }
        });
    }
    static exists(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_connect_1.default.query(`SELECT * FROM articles WHERE id = ?`, [articleId]);
            return rows.length > 0;
        });
    }
    static delete(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_connect_1.default.query(`DELETE FROM articles where id = '${articleId}'`);
        });
    }
    static isLiked(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [likedRecord] = yield db_connect_1.default.query(`SELECT * FROM articles WHERE id = ? AND userId = ?`, [articleId, userId]);
            return likedRecord.length > 0;
        });
    }
    static addLike(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_connect_1.default.query("INSERT INTO article_likes (articleId, userId) VALUES (?, ?)", [articleId, userId]);
            // Increment the likes count in the articles table
            yield db_connect_1.default.query("UPDATE articles SET likes = likes + 1 WHERE id = ?", [
                articleId,
            ]);
        });
    }
    static removeLike(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_connect_1.default.query("DELETE FROM article_likes WHERE articleId = ? AND userId = ?", [articleId, userId]);
            // Decrement the likes count in the articles table
            yield db_connect_1.default.query("UPDATE articles SET likes = likes - 1 WHERE id = ?", [
                articleId,
            ]);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_connect_1.default.query("SELECT * FROM articles"); // Execute the query
                return rows; // Return the fetched articles
            }
            catch (error) {
                console.error("Error fetching articles by keyword:", error);
                throw error; // Rethrow the error for handling in the controller
            }
        });
    }
    static getTrending(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            const query = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      LEFT JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      WHERE a.privacy = 'public'
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.username, u.profilePicture, f.userId;
    `;
            try {
                const [rows] = yield db_connect_1.default.query(query); // Execute the query
                return rows; // Return the fetched articles
            }
            catch (error) {
                console.error("Error fetching trending articles:", error);
                throw error; // Rethrow the error for handling in the controller
            }
        });
    }
    static getByKeyword(keywordId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.id AS userId, 
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      JOIN article_keywords ak ON a.id = ak.articleId
      WHERE a.privacy = 'public' 
        AND ak.keywordId = ${keywordId}
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.id, u.username, u.profilePicture, f.userId;
      `;
            try {
                const [rows] = yield db_connect_1.default.query(sql, [keywordId]);
                return rows;
            }
            catch (error) {
                console.error("Error fetching articles by keyword:", error);
                throw error;
            }
        });
    }
    static getById(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const articlesQuery = `
    SELECT a.id,
      a.title,
      a.description,
      a.content,
      a.likes,
      a.articleDate,
      a.articleImage,
      u.username,
      u.profilePicture,
      u.id as userId
      FROM articles a 
      JOIN users u ON a.userId = u.id
      WHERE a.privacy="public" AND 
      a.id = 1
    `;
            const [articles] = yield db_connect_1.default.query(articlesQuery, [articleId]);
            if (articles.length === 0) {
                return null;
            }
            const article = articles[0];
            const keywordsQuery = `
    SELECT 
      k.id,
      k.keywordName
    FROM article_keywords ak
    JOIN keywords k ON ak.keywordId = k.id
    WHERE ak.articleId = ?
  `;
            const [keywords] = yield db_connect_1.default.query(keywordsQuery, [article.id]);
            const [comments] = yield db_connect_1.default.query(`SELECT * FROM comments WHERE articleId = ?`, [article.id]);
            article.comments = comments;
            article.keywords = keywords;
            return article;
        });
    }
    static getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      LEFT JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      WHERE a.privacy = 'public' AND f.userId = ${userId}
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.username, u.profilePicture, f.userId;
    `;
            const [articles] = yield db_connect_1.default.query(query);
            return articles;
        });
    }
    static addFavorite(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO favorites(userId, articleId) VALUES(?, ?)`;
            yield db_connect_1.default.query(query, [userId, articleId]);
        });
    }
    static removeFavorite(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM favorites WHERE userId = ? AND articleId = ?`;
            yield db_connect_1.default.query(query, [userId, articleId]);
        });
    }
    static addKeywords(articleId, keywordIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQueries = keywordIds
                .map((keywordId) => `(${articleId}, ${keywordId})`)
                .join(", ");
            // SQL query to insert keywords into article_keywords table
            const sql = `INSERT INTO article_keywords (articleId, keywordId) 
                 VALUES ${insertQueries} 
                 ON DUPLICATE KEY UPDATE keywordId = keywordId`;
            yield db_connect_1.default.query(sql);
        });
    }
}
exports.ArticleModel = ArticleModel;
