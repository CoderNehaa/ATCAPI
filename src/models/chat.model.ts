import pool from "../config/db.connect";

export interface ChatInterface {
  chatId?: number;
  userId: number;
  joinedAt: Date;
}

export class ChatModel {
  static async createChat(type: string, name: string, dp: string) {
    const result: any = await pool.query(
      `INSERT INTO chats (type, name, dp) VALUES (?, ?, ?)`,
      [type, name, dp]
    );
    const newChatId = result[0].insertId;
    return newChatId;
  }

  static async addParticipants(chatId: number, participants: number[], currentUserId:number) {
    const insertQuery = participants
      .map((userId) => `(${chatId}, ${userId})`)
      .join(", ");
    const sql = `INSERT INTO participants(chatId, userId) VALUES ${insertQuery} ON DUPLICATE KEY UPDATE userId = userId`;
    await pool.query(sql);
    const newChat = await this.getChatById(chatId, currentUserId);
    return newChat;
  }

  static async getChatsByUserId(userId: number) {
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
    const [chats]: any = await pool.query(query);
    return chats;
  }

  static async getChatById(chatId:number, currentUserId:number){
    const query = 
    `SELECT
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
    
    const [chats]: any = await pool.query(query);
    return chats[0];
  }

  static async addMessage(chatId: number, senderId: number, message: string) {
    const query =
      "INSERT INTO messages (chatId, senderId, message) VALUES (?, ?, ?)";
    await pool.query(query, [chatId, senderId, message]);
  }

  static async getMessages(chatId: number) {
    const query = ` SELECT m.*, u.username AS senderName 
        FROM messages m JOIN users u 
        ON m.senderId = u.id
        WHERE chatId = ? 
        ORDER BY sentAt`;
    //chat = type, name,
    // users array - participants of chat(each participant with name, bio, profilePicture)
    // given userId should not be included in users array

    const messages = await pool.query(query, [chatId]);
    return messages;
  }

}
