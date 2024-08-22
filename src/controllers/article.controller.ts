import { Request, Response } from "express";
import { ArticleInterface, ArticleModel } from "../models/article.model";
import { ResponseInterface } from "../interfaces/response.interface";
import pool from "../config/db.connect";
import { UserModel } from "../models/user.model";

interface Article {
  id: number;
  title: string;
  description: string;
  articleBody: string;
}

class ArticleController {
  async getAllArticles(req: Request, res: Response): Promise<Response> {
    try {
      const articles = await ArticleModel.getAll();
      const responseObj: ResponseInterface<typeof articles> = {
        result: true,
        message: "All articles fetched successfully",
        data: articles,
      };
      return res.status(200).send(responseObj);
    } catch (e) {
      console.log("Error occurred while getting all articles : ", e);
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting all articles",
      };
      return res.status(500).send(responseObj);
    }
  }

  async getTrendingArticles(req: Request, res: Response): Promise<Response> {
    try {      
      const userId = parseInt(req.params.userId); 
      const articles = await ArticleModel.getTrending(userId?userId:0);
      const responseObj: ResponseInterface<typeof articles> = {
        result: true,
        message: "Trending articles fetched successfully",
        data: articles,
      };
      return res.status(200).send(responseObj);
    } catch (e) {
      console.log("Error occurred while getting trending articles : ", e);
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting trending articles",
      };
      return res.status(500).send(responseObj);
    }
  }

  async getArticlesByKeywords(req: Request, res: Response): Promise<Response> {
    try {
      const user:any = req.user;
      const keywordId = parseInt(req.params.keywordId);
      const articles = await ArticleModel.getByKeyword(keywordId, user?user.id:0);
      const responseObj: ResponseInterface<typeof articles> = {
        result: true,
        data: articles
      };
      return res.status(200).send(responseObj);
    } catch (e) {
      console.log(
        "Error occurred while getting articles filtered by category : ",
        e
      );
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting articles filtered by category",
      };
      return res.status(200).send(responseObj);
    }
  }

  async getUserFavoriteArticles(req:Request, res:Response){
    try{
      const user:any = req.user;
      if(!user){
        return;
      }
      const articles = await ArticleModel.getFavorites(user.id);
      const successRes :ResponseInterface<typeof articles> = {
        result:true,
        data:articles
      }
      return res.status(200).send(successRes);
    } catch (e){
      console.log(e);
      return res.status(200).send({
        result:false,
        message:"Could not fetch favorite articles! Try later"
      })
    }
  }

  async getArticleByArticleId(req: Request, res: Response): Promise<Response> {
    try {
      const articleId = parseInt(req.params.articleId);
      if(isNaN(articleId)){
        return res.status(400).send({
          result:false,
          message:"Invalid Article ID"
        })
      }
      const article = await ArticleModel.getById(articleId);
      if (article) {
        const responseObj: ResponseInterface<typeof article> = {
          result: true,
          message: "Article fetched successfully",
          data: article,
        };
        return res.status(200).send(responseObj);
      }
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Article not found",
      };
      return res.status(404).send(responseObj);
    } catch (e) {
      console.log("Error occurred while getting article by article id : ", e);
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting article by article id",
      };
      return res.status(500).send(responseObj);
    }
  }

  async getArticlesByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const [authorArticles] = await pool.query(
        `SELECT * FROM articles where userId = ${userId}`
      );
      if (authorArticles) {
        const responseObj: ResponseInterface<typeof authorArticles> = {
          result: true,
          message: "Data fetched successfully",
          data: authorArticles,
        };
        return res.status(200).send(responseObj);
      }
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Article written by this author not found",
      };
      return res.status(404).send(responseObj);
    } catch (e) {
      console.log(
        "Error occurred while getting article by user/autor id : ",
        e
      );
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting article by author id",
      };
      return res.status(500).send(responseObj);
    }
  }

  async addNewArticle(req: Request, res: Response): Promise<Response> {
    try {
      const article: ArticleInterface = req.body;
      //take care of duplicate title of article
      
      // Validate required fields
      if (!article.title || !article.userId || !article.content) {
        return res.status(400).send({
          result: false,
          message: "Title, userId, and content are required fields.",
        });
      }

      //save new article to db
      await ArticleModel.create(article);

      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "Article added successfully",
      };
      return res.status(201).send(succResponse);
    } catch (e) {
      console.log("Error occurred while adding new article : ", e);
      const responseObj: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while adding new article",
      };
      return res.status(500).send(responseObj);
    }
  }

  async updateArticle(req: Request, res: Response): Promise<Response> {
    try {
      const { articleId } = req.params;
      const updatedArticle = req.body;
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "Article updated successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log("Error while getting articles by user id : ", e);
      const erResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while updating article",
      };
      return res.status(500).send(erResponse);
    }
  }

  async deleteArticle(req: Request, res: Response): Promise<Response> {
    try {
      const articleId = parseInt(req.params.articleId);

      if (isNaN(articleId)) {
        const errResponse: ResponseInterface<void> = {
          result: false,
          message: "Invalid Article ID",
        };
        return res.status(404).send(errResponse);
      }

      const articleExists = await ArticleModel.exists(articleId);
      if (!articleExists) {
        const errResponse: ResponseInterface<void> = {
          result: false,
          message: "Article not found",
        };
        return res.status(404).send(errResponse);
      }

      await ArticleModel.delete(articleId);
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "Article deleted successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log("Error while deleting article : ", e);
      const erResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while deleting article",
      };
      return res.status(500).send(erResponse);
    }
  }

  async addKeywordsToArticle(req: Request, res: Response): Promise<Response> {
    try {
      const {
        articleId,
        keywordIds,
      }: { articleId: number; keywordIds: number[] } = req.body;
      if (!articleId || !Array.isArray(keywordIds) || keywordIds.length === 0) {
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message:
            "Invalid input. Please provide a valid article ID and an array of keyword IDs.",
        };
        return res.status(400).send(errResponse);
      }

      await ArticleModel.addKeywords(articleId, keywordIds);

      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "Keywords added to article successfully",
      };
      return res.status(500).send("done");
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Internal server error",
      };
      return res.status(500).send(errResponse);
    }
  }

  async addToFavorites(req:Request, res:Response){
    try{
      const user:any = req.user;
      const articleId = parseInt(req.params.articleId);
      await ArticleModel.addFavorite(user.id, articleId);
      return res.status(200).send({
        result:true,
        message:"Article added to Bookmarks."
      })
    } catch (e){
      console.log(e);
      return res.status(200).send({
        result:false,
        message:"Failed to add article to Bookmarks! Try later."
      })
    }
  }

  async removeFromFavorites(req:Request, res:Response){
    try{
      const user:any = req.user;
      const articleId = parseInt(req.params.articleId);
      await ArticleModel.removeFavorite(user.id, articleId);
      return res.status(200).send({
        result:true,
        message:"Article removed from Bookmarks."
      })
    } catch (e){
      console.log(e);
      return res.status(200).send({
        result:false,
        message:"Failed to remove articles from Bookmarks! Try later."
      })
    }
  }
  
  async toggleLikes(req: Request, res: Response): Promise<Response> {
    try {
      const articleId = parseInt(req.params.articleId);
      const userId = parseInt(req.params.userId);
      let responseObj: ResponseInterface<void> = {
        result: false,
        message: "",
      };

      //check if user exists
      const userExist = await UserModel.getbyId(userId);
      if (!userExist.result) {
        responseObj.message = "User not found";
        return res.status(404).send(responseObj);
      }

      //check if article exists
      const articleExist: boolean = await ArticleModel.exists(articleId);
      if (!articleExist) {
        responseObj.message = "Article not found";
        return res.status(404).send(responseObj);
      }

      //check if article is already liked or not
      const isArticleLiked = await ArticleModel.isLiked(articleId, userId);

      if (isArticleLiked) {
        //remove like
        await ArticleModel.removeLike(articleId, userId);
        responseObj.result = true;
        responseObj.message = "Like removed successfully";
      } else {
        //add like
        await ArticleModel.addLike(articleId, userId);
        responseObj.result = true;
        responseObj.message = "Like added successfully";
      }
      return res.status(200).send(responseObj);
    } catch (e) {
      console.log("Error in toggle like ", e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Internal server error",
      };
      return res.status(500).send(errResponse);
    }
  }

}

export default ArticleController;
