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
exports.ChatController = void 0;
const db_connect_1 = __importDefault(require("../config/db.connect"));
const chat_model_1 = require("../models/chat.model");
class ChatController {
    constructor() {
        this.createChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { type, name, participants, dp } = req.body;
            const user = req.user;
            const currentUserId = user.id;
            try {
                const newChatId = yield chat_model_1.ChatModel.createChat(type, name, dp);
                const newChat = yield chat_model_1.ChatModel.addParticipants(newChatId, participants, currentUserId);
                res
                    .status(201)
                    .send({ result: true, message: "Chat created successfully", data: newChat });
            }
            catch (error) {
                console.log(error);
                res
                    .status(201)
                    .send({ result: true, message: "Failed to create chat! Try again." });
            }
        });
        this.getChats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errResponse = {
                result: false,
                message: "",
            };
            try {
                const user = req.user;
                const chats = yield chat_model_1.ChatModel.getChatsByUserId(user.id);
                return res.status(200).send({ result: true, data: chats });
            }
            catch (e) {
                console.log(e);
                errResponse.message = "'Internal server error while fetching chats'";
                return res.status(200).send(errResponse);
            }
        });
        this.addParticipantToGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const responseObj = {
                result: true,
                message: "",
            };
            try {
                const { chatId, userId } = req.body;
                yield db_connect_1.default.query(`INSERT INTO participants(chatId, userId) VALUES(${chatId}, ${userId})`);
                responseObj.message = "Member added in group";
                return res.status(201).send(responseObj);
            }
            catch (e) {
                console.log(e);
                responseObj.result = false;
                responseObj.message = "Failed to add member! Try again";
                return res.status(201).send(responseObj);
            }
        });
        this.removeParticipantFromGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const responseObj = {
                result: true,
                message: "",
            };
            try {
                const { chatId, userId } = req.body;
                yield db_connect_1.default.query(`DELETE FROM participants WHERE chatId = ? AND userId=?`, [chatId, userId]);
                responseObj.message = "Member removed from group";
                return res.status(201).send(responseObj);
            }
            catch (e) {
                console.log(e);
                responseObj.result = false;
                responseObj.message = "Failed to add member! Try again";
                return res.status(201).send(responseObj);
            }
        });
        this.sendMessageToChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, message } = req.body;
                const user = req.user;
                const senderId = user.id;
                yield chat_model_1.ChatModel.addMessage(chatId, senderId, message);
                res.status(201).send({ result: true, message: "Message sent" });
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .send({ result: false, message: "Message send failed! Try again" });
            }
        });
        this.getMessagesByChatId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = parseInt(req.params.chatId);
                const messages = yield chat_model_1.ChatModel.getMessages(chatId);
                res.status(200).send({ result: true, data: messages[0] });
            }
            catch (error) {
                console.log(error);
                res
                    .status(200)
                    .send({ result: true, message: "Failed to get messages! Try later." });
            }
        });
    }
}
exports.ChatController = ChatController;
