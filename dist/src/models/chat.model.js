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
exports.ChatModel = void 0;
const db_connect_1 = __importDefault(require("../config/db.connect"));
class ChatModel {
    static createChat(type, name, dp) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_connect_1.default.query(`INSERT INTO chats (type, name, dp) VALUES (?, ?, ?)`, [type, name, dp]);
            const newChatId = result[0].insertId;
            return newChatId;
        });
    }
    static addParticipants(chatId, participants, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = participants
                .map((userId) => `(${chatId}, ${userId})`)
                .join(", ");
            const sql = `INSERT INTO participants(chatId, userId) VALUES ${insertQuery} ON DUPLICATE KEY UPDATE userId = userId`;
            yield db_connect_1.default.query(sql);
            const newChat = yield this.getChatById(chatId, currentUserId);
            return newChat;
        });
    }
    static getChatsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT
    c.*,
    (
        SELECT
            JSON_OBJECT(
                'userId', u.id,
                'username', u.username,
                'profilePicture', u.profilePicture
            )
        FROM
            users u
        WHERE
            u.id = (
                SELECT
                    p2.userId
                FROM
                    participants p2
                WHERE
                    p2.chatId = c.id
                    AND p2.userId != ${userId}
                    AND c.type = 'individual'
                LIMIT 1
            )
    ) AS receiver
FROM
    chats c
JOIN
    participants p ON c.id = p.chatId
WHERE
    p.userId = ${userId}
GROUP BY
    c.id;

        `;
            const [chats] = yield db_connect_1.default.query(query);
            return chats;
        });
    }
    static getChatById(chatId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT
        c.*,
        (
            SELECT
                JSON_OBJECT(
                    'userId', u.id,
                    'username', u.username,
                    'profilePicture', u.profilePicture
                )
            FROM
                users u
            WHERE
                u.id = (
                    SELECT
                        p2.userId
                    FROM
                        participants p2
                    WHERE
                        p2.chatId = c.id
                        AND p2.userId != ${currentUserId}
                        AND c.type = 'individual'
                    LIMIT 1
                )
        ) AS receiver
    FROM
        chats c
    JOIN
        participants p ON c.id = p.chatId
    WHERE
        p.userId = ${currentUserId}
        AND c.id = ${chatId}
    GROUP BY
        c.id;`;
            const [chats] = yield db_connect_1.default.query(query);
            return chats[0];
        });
    }
    static addMessage(chatId, senderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "INSERT INTO messages (chatId, senderId, message) VALUES (?, ?, ?)";
            yield db_connect_1.default.query(query, [chatId, senderId, message]);
        });
    }
    static getMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = ` SELECT m.*, u.username AS senderName 
        FROM messages m JOIN users u 
        ON m.senderId = u.id
        WHERE chatId = ? 
        ORDER BY sentAt`;
            //chat = type, name,
            // users array - participants of chat(each participant with name, bio, profilePicture)
            // given userId should not be included in users array
            const messages = yield db_connect_1.default.query(query, [chatId]);
            return messages;
        });
    }
}
exports.ChatModel = ChatModel;
