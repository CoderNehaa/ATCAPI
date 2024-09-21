import pool from "../config/db.connect";

export interface CommentInterface {
  id?: number; //unique(primary key)
  userId: number; //required
  articleId: number; //required
  comment: string; //required
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
    const result = await pool.query(
      `INSERT INTO comments (userId, articleId, comment) VALUE(?, ?, ?)`,
      [comment.userId, comment.articleId, comment.comment]
    );
    console.log(result);
    
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
