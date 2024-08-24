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
    const result: any = await pool.query(
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

    if (article.keywords && article.keywords.length) {
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

  static async getAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM articles"); // Execute the query
      return rows; // Return the fetched articles
    } catch (error) {
      console.error("Error fetching articles by keyword:", error);
      throw error; // Rethrow the error for handling in the controller
    }
  }

  static async getTrending(userId:number) {
    const query = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      LEFT JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      WHERE a.privacy = 'public'
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.username, u.profilePicture, f.userId;
    `;

    try {
      const [rows] = await pool.query(query); 
      return rows; 
    } catch (error) {
      console.error("Error fetching trending articles:", error);
      throw error; // Rethrow the error for handling in the controller
    }
  }

  static async getByKeyword(keywordId: number, userId:number): Promise<any> {
    const sql = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.id AS userId, 
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      JOIN article_keywords ak ON a.id = ak.articleId
      WHERE a.privacy = 'public' 
        AND ak.keywordId = ${keywordId}
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.id, u.username, u.profilePicture, f.userId;
      `;
    try {
      const [rows] = await pool.query(sql, [keywordId]);
      return rows;
    } catch (error) {
      console.error("Error fetching articles by keyword:", error);
      throw error;
    }
  }

  static async getById(articleId: number): Promise<any> {
    const articlesQuery = `
    SELECT a.id,
      a.title,
      a.description,
      a.content,
      a.likes,
      a.articleDate,
      a.articleImage,
      u.username,
      u.profilePicture,
      u.id as userId
      FROM articles a 
      JOIN users u ON a.userId = u.id
      WHERE a.privacy="public" AND 
      a.id = 1
    `;
    const [articles]: any = await pool.query(articlesQuery, [articleId]);

    if (articles.length === 0) {
      return null;
    }
    const article = articles[0];
    const keywordsQuery = `
    SELECT 
      k.id,
      k.keywordName
    FROM article_keywords ak
    JOIN keywords k ON ak.keywordId = k.id
    WHERE ak.articleId = ?
  `;

    const [keywords]: any = await pool.query(keywordsQuery, [article.id]);
    const [comments] = await pool.query(
      `SELECT * FROM comments WHERE articleId = ?`,
      [article.id]
    );
    article.comments = comments;
    article.keywords = keywords;

    return article;
  }

  static async getFavorites(userId: number) {
    const query = `
      SELECT a.id, 
        a.title, 
        a.description, 
        a.articleImage, 
        a.likes, 
        a.articleDate, 
        a.privacy, 
        COUNT(ac.commentId) AS comments,
        u.username, 
        u.profilePicture,
        CASE 
            WHEN f.userId = ${userId} THEN TRUE
            ELSE FALSE
        END AS isFavorite
      FROM articles a 
      LEFT JOIN users u ON a.userId = u.id
      LEFT JOIN favorites f ON f.articleId = a.id AND f.userId = ${userId}
      LEFT JOIN article_comments ac ON ac.articleId = a.id
      WHERE a.privacy = 'public' AND f.userId = ${userId}
      GROUP BY a.id, a.title, a.description, a.articleImage, a.likes, a.articleDate, a.privacy, u.username, u.profilePicture, f.userId;
    `;
    const [articles] = await pool.query(query);
    return articles;
  }

  static async addFavorite(userId: number, articleId: number) {
    const query = `INSERT INTO favorites(userId, articleId) VALUES(?, ?)`;
    await pool.query(query, [userId, articleId]);
  }

  static async removeFavorite(userId: number, articleId: number) {
    const query = `DELETE FROM favorites WHERE userId = ? AND articleId = ?`;
    await pool.query(query, [userId, articleId]);
  }

  static async addKeywords(
    articleId: number,
    keywordIds: number[]
  ): Promise<void> {
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
