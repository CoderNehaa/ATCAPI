import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import CommentController from '../controllers/comment.controller';

const articleRouter = express();
const commentController = new CommentController();

articleRouter.get('/:articleId', authMiddleware, commentController.getCommentsByArticleId);
articleRouter.post('/add', authMiddleware, commentController.addComment);
articleRouter.put('/update/:commentId', authMiddleware, commentController.editComment);
articleRouter.delete('/remove/:commentId', authMiddleware, commentController.removeComment);

export default articleRouter;
