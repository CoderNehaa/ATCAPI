import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ChatController } from '../controllers/chat.controller';

const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post('/', authMiddleware, chatController.createChat);
chatRouter.get('/', authMiddleware, chatController.getChats);

//get chats by user id
chatRouter.post('/group/add', authMiddleware, chatController.addParticipantToGroup);
chatRouter.post('/group/remove', authMiddleware, chatController.removeParticipantFromGroup);

chatRouter.get('/messages/all/:chatId', authMiddleware, chatController.getMessagesByChatId);
chatRouter.post('/messages/add/', authMiddleware, chatController.sendMessageToChat);

export default chatRouter;
