import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { KeywordController } from '../controllers/keyword.controller';

const keywordRouter = express();
const keywordController = new KeywordController();

keywordRouter.get('/all', keywordController.getAllKeywords);
keywordRouter.post('/add', authMiddleware, keywordController.addKeyword);
keywordRouter.delete('/remove/:keywordId', authMiddleware, keywordController.deleteKeyword);
      
export default keywordRouter;
