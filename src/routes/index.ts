import express, {Request, Response} from 'express';
import userRouter from './users.routes';
import articleRouter from './article.routes';
import commentRouter from './comment.route';
import keywordRouter from './keyword.routes';
import chatRouter from './chat.routes';

const router = express.Router();

router.use('/users', userRouter);
router.use('/articles', articleRouter);
router.use('/comments', commentRouter);
router.use('/keywords', keywordRouter);
router.use('/chats', chatRouter);

router.get('/', (req:Request, res:Response) => {
    return res.send("Browse API on http://localhost:3200/api/")
})

export default router;

