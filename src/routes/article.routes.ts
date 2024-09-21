import express from 'express';
import ArticleController from '../controllers/article.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const articleRouter = express();
const articleController = new ArticleController();

articleRouter.get('/all', articleController.getAllArticles);
articleRouter.get('/trending/:userId', articleController.getTrendingArticles);

articleRouter.get('/details/:articleId/bookmark/:userId', articleController.getArticleByArticleId);
articleRouter.get('/author/:userId', articleController.getArticlesByUserId);

articleRouter.post('/add', authMiddleware, articleController.addNewArticle);
articleRouter.put('/update/:articleId', authMiddleware, articleController.updateArticle);
articleRouter.delete('/remove/:articleId', authMiddleware, articleController.deleteArticle);

// like
articleRouter.post('/likes/:articleId/', authMiddleware, articleController.toggleLikes);

//keywords
articleRouter.post('/add-keywords', authMiddleware, articleController.addKeywordsToArticle);
articleRouter.get('/keyword/:keywordId', articleController.getArticlesByKeywords);

//favorites
articleRouter.get('/favorites', authMiddleware, articleController.getUserFavoriteArticles);
articleRouter.post('/favorites/add/:articleId', authMiddleware, articleController.addToFavorites);
articleRouter.delete('/favorites/remove/:articleId', authMiddleware, articleController.removeFromFavorites);


export default articleRouter;
