import pool from "../config/db.connect";

enum Privacy {
  private,
  public,
}

enum Language {
  hindi,
  english,
}

export interface ArticleInterface {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  content: string;
  keywords?: [];
  articleImage?: string;
  likes?: number;
  articleDate?: Date;
  privacy: Privacy;
  language: Language;
}

export class ArticleModel {
  static async create(article: ArticleInterface): Promise<void> {
    const result:any = await pool.query(
      `INSERT INTO 
      articles(userId, title, description, content, articleImage, privacy, language)
      VALUE(?, ?, ?, ?, ?, ?, ?)
      `,
      [
        article.userId,
        article.title,
        article.description,
        article.content,
        article.articleImage,
        article.privacy,
        article.language,
      ]
    );
    const newArticleId = result[0].insertId;
    
    if(article.keywords && article.keywords.length){
      await this.addKeywords(newArticleId, article.keywords);
    }
  }

  static async exists(articleId: number): Promise<boolean> {
    const [rows]: Array<any> = await pool.query(
      `SELECT * FROM articles WHERE id = ?`,
      [articleId]
    );
    return rows.length > 0;
  }

  static async delete(articleId: number): Promise<void> {
    await pool.query(`DELETE FROM articles where id = '${articleId}'`);
  }

  static async isLiked(userId: number, articleId: number): Promise<boolean> {
    const [likedRecord]: Array<any> = await pool.query(
      `SELECT * FROM articles WHERE id = ? AND userId = ?`,
      [articleId, userId]
    );
    return likedRecord.length > 0;
  }

  static async addLike(userId: number, articleId: number): Promise<void> {
    await pool.query(
      "INSERT INTO article_likes (articleId, userId) VALUES (?, ?)",
      [articleId, userId]
    );

    // Increment the likes count in the articles table
    await pool.query("UPDATE articles SET likes = likes + 1 WHERE id = ?", [
      articleId,
    ]);
  }

  static async removeLike(userId: number, articleId: number): Promise<void> {
    await pool.query(
      "DELETE FROM article_likes WHERE articleId = ? AND userId = ?",
      [articleId, userId]
    );
    // Decrement the likes count in the articles table
    await pool.query("UPDATE articles SET likes = likes - 1 WHERE id = ?", [
      articleId,
    ]);
  }

  static async getByKeyword(keywordId: number): Promise<any> {
    const sql = `
      SELECT a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, 
      u.id AS userId, u.username, u.profilePicture FROM articles a
      JOIN users u ON a.userId = u.id
      JOIN article_keywords ak on a.id = ak.articleId
      WHERE ak.keywordId = ?
      GROUP BY a.id, u.id
      `;
    try {
      const [rows] = await pool.query(sql, [keywordId]); // Execute the query
      return rows; // Return the fetched articles
    } catch (error) {
      console.error("Error fetching articles by keyword:", error);
      throw error; // Rethrow the error for handling in the controller
    }
  }

  static async addKeywords(articleId:number, keywordIds:number[]):Promise<void>{
      const insertQueries = keywordIds
        .map((keywordId) => `(${articleId}, ${keywordId})`)
        .join(", ");
      
      // SQL query to insert keywords into article_keywords table
      const sql = `INSERT INTO article_keywords (articleId, keywordId) 
                 VALUES ${insertQueries} 
                 ON DUPLICATE KEY UPDATE keywordId = keywordId`;

      await pool.query(sql);
  }
}
