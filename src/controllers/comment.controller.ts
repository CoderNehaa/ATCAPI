import { NextFunction, Request, Response } from 'express';
import { ResponseInterface } from '../interfaces/response.interface';
import { CommentInterface, CommentModel } from '../models/comment.model';

class CommentController {
  async addComment(req:Request, res:Response, next:NextFunction) {
    const {userId, articleId, comment} = req.body;
    const newComment :CommentInterface = { userId, articleId, comment }
    await CommentModel.create(newComment);
    
    try {
      const succResponse : ResponseInterface<void> = {
        result: true,
        message: 'Comment added successfully',
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse : ResponseInterface<Error> = {
        result: false,
        message: 'Error occurred while adding comment',
      };
      return res.status(500).send(errResponse);
    }
  }

  //below function pending
  async editComment(req:Request, res:Response) {
    try {
      const commentId = parseInt(req.params.commentId);
      const {text} = req.body;
      
      const oldComment:CommentInterface = await CommentModel.getById(commentId);
      oldComment.comment = text;
      await CommentModel.update(oldComment);

      const succResponse : ResponseInterface<void> = {
        result: false,
        message: 'Comment updated successfully'
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse : ResponseInterface<Error> = {
        result: false,
        message: 'Error occurred while editing comment',
      };
      return res.status(500).send(errResponse);
    }
  }

  async removeComment(req:Request, res:Response) {
    try {
      const commentId = parseInt(req.params.commentId);
      const commentExist = await CommentModel.getById(commentId);
      if(!commentExist){
        const errResponse : ResponseInterface<Error> = {
          result: false,
          message: 'Comment not found',
        };        
        return res.status(404).send(errResponse);
      }
      await CommentModel.delete(commentId);
      const succResponse : ResponseInterface<void> = {
        result: true,
        message: 'Comment deleted successfully'
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse : ResponseInterface<Error> = {
        result: false,
        message: 'Error occurred while removing comment',
      };
      return res.status(500).send(errResponse);
    }
  }

  async getCommentsByArticleId(req:Request, res:Response) {
    try {
      const articleId = parseInt(req.params.articleId);
      const comments = await CommentModel.getByArticleId(articleId);
      const succResponse : ResponseInterface<typeof comments> = {
        result: false,
        message: 'Comments fetched successfully',
        data: comments,
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse : ResponseInterface<Error> = {
        result: false,
        message: 'Error occurred while getting comments by article id',
      };
      return res.status(500).send(errResponse);
    }
  }
}

export default CommentController;


