import { Request, Response } from "express";
import pool from "../config/db.connect";
import { ChatModel } from "../models/chat.model";
import { ResponseInterface } from "../interfaces/response.interface";

export class ChatController {
  createChat = async (req: Request, res: Response) => {
    const { type, name, participants, dp } = req.body;
    const user:any = req.user;
    const currentUserId = user.id;
    try {
      const newChatId = await ChatModel.createChat(type, name, dp);
      const newChat = await ChatModel.addParticipants(newChatId, participants, currentUserId);
      res
        .status(201)
        .send({ result: true, message: "Chat created successfully", data:newChat });
    } catch (error: any) {
      console.log(error);
      res
        .status(201)
        .send({ result: true, message: "Failed to create chat! Try again." });
    }
  };

  getChats = async (req: Request, res: Response) => {
    const errResponse: ResponseInterface<Error> = {
      result: false,
      message: "",
    };
    try {
      const user: any = req.user;
      const chats = await ChatModel.getChatsByUserId(user.id);
      return res.status(200).send({ result: true, data: chats });
    } catch (e) {
      console.log(e);
      errResponse.message = "'Internal server error while fetching chats'";
      return res.status(200).send(errResponse);
    }
  };

  addParticipantToGroup = async (req: Request, res: Response) => {
    const responseObj: ResponseInterface<any> = {
      result: true,
      message: "",
    };
    try {
      const { chatId, userId } = req.body;
      await pool.query(
        `INSERT INTO participants(chatId, userId) VALUES(${chatId}, ${userId})`
      );
      responseObj.message = "Member added in group";
      return res.status(201).send(responseObj);
    } catch (e) {
      console.log(e);
      responseObj.result = false;
      responseObj.message = "Failed to add member! Try again";
      return res.status(201).send(responseObj);
    }
  };

  removeParticipantFromGroup = async (req: Request, res: Response) => {
    const responseObj: ResponseInterface<any> = {
      result: true,
      message: "",
    };
    try {
      const { chatId, userId } = req.body;
      await pool.query(
        `DELETE FROM participants WHERE chatId = ? AND userId=?`, [chatId, userId]
      );
      responseObj.message = "Member removed from group";
      return res.status(201).send(responseObj);
    } catch (e) {
      console.log(e);
      responseObj.result = false;
      responseObj.message = "Failed to add member! Try again";
      return res.status(201).send(responseObj);
    }
  };

  sendMessageToChat = async (req: Request, res: Response) => {
    try {
      const { chatId, message } = req.body;
      const user: any = req.user;
      const senderId = user.id;
      await ChatModel.addMessage(chatId, senderId, message);
      res.status(201).send({ result: true, message: "Message sent" });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .send({ result: false, message: "Message send failed! Try again" });
    }
  };

  getMessagesByChatId = async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const messages = await ChatModel.getMessages(chatId);
      res.status(200).send({ result: true, data: messages[0] });
    } catch (error: any) {
      console.log(error);
      res
        .status(200)
        .send({ result: true, message: "Failed to get messages! Try later." });
    }
  };
}


