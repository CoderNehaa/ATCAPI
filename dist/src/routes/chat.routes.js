"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const chatRouter = (0, express_1.Router)();
const chatController = new chat_controller_1.ChatController();
chatRouter.post('/', auth_middleware_1.authMiddleware, chatController.createChat);
chatRouter.get('/', auth_middleware_1.authMiddleware, chatController.getChats);
//get chats by user id
chatRouter.post('/group/add', auth_middleware_1.authMiddleware, chatController.addParticipantToGroup);
chatRouter.post('/group/remove', auth_middleware_1.authMiddleware, chatController.removeParticipantFromGroup);
chatRouter.get('/messages/all/:chatId', auth_middleware_1.authMiddleware, chatController.getMessagesByChatId);
chatRouter.post('/messages/add/', auth_middleware_1.authMiddleware, chatController.sendMessageToChat);
exports.default = chatRouter;
