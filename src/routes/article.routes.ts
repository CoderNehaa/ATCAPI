import express from 'express';
import ArticleController from '../controllers/article.controller';
import { authMiddleware } from '../middlewares/jwtAuth.middleware';

const articleRouter = express();
const articleController = new ArticleController();

articleRouter.get('/all', articleController.getAllArticles);
articleRouter.get('/:articleId', articleController.getArticleByArticleId);
articleRouter.get('/author/:userId', articleController.getArticlesByUserId);
articleRouter.get('/trending', articleController.getTrendingArticles);
articleRouter.get('/language/:language', articleController.getArticleByLanguage);

articleRouter.post('/add', authMiddleware, articleController.addNewArticle);
articleRouter.put('/update/:articleId', authMiddleware, articleController.updateArticle);
articleRouter.delete('/remove/:articleId', authMiddleware, articleController.deleteArticle);

// like
articleRouter.post('/likes/:articleId/:userId', authMiddleware, articleController.toggleLikes);

//keywords
articleRouter.post('/add-keywords', authMiddleware, articleController.addKeywordsToArticle);
articleRouter.get('/keyword/:keywordId', articleController.getArticlesByKeywords);

export default articleRouter;
