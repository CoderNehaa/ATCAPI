import pool from "../config/db.connect";

export interface CommentInterface {
  id?: number; //unique(primary key)
  userId: number; //required
  articleId: number; //required
  text: string; //required
  commentDate?: Date; //handled in db, by default date.now()
}

export class CommentModel {
  static async getById(id: number): Promise<CommentInterface> {
    const [comment]: Array<any> = await pool.query(
      `SELECT * FROM comments WHERE id = ${id}`
    );
    return comment[0];
  }

  static async create(comment: CommentInterface): Promise<void> {
    await pool.query(
      `INSERT INTO comments (userId, articleId, text, commentDate) VALUE(?, ?, ?, ?)`,
      [comment.userId, comment.articleId, comment.text, comment.commentDate]
    );
  }

  static async update(updatedComment: CommentInterface): Promise<void> {
      
  }

  static async delete(commentId: number): Promise<void> {
    await pool.query(`DELETE FROM comments WHERE id = ${commentId}`);
  }

  static async getByArticleId(articleId: number): Promise<void> {
    const [comments]: Array<any> = await pool.query(
      `SELECT * FROM comments articleId = ${articleId}`
    );
    return comments;
  }
}
