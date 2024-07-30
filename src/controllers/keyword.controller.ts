import { Request, Response } from "express";
import { ResponseInterface } from "../interfaces/response.interface";
import { KeywordModel } from "../models/keyword.model";

export class KeywordController {
  async addKeyword(req: Request, res: Response): Promise<Response> {
    const { keywordName } = req.body;
    const isPresent = await KeywordModel.keywordNameExists(keywordName);
    const succResponse: ResponseInterface<void> = {
      result: false,
      message: "",
    };

    if (isPresent) {
      succResponse.message = "Keyword already exists";
      return res.status(400).send(succResponse);
    }

    await KeywordModel.create(keywordName);
    try {
      succResponse.result = true;
      succResponse.message = "Keyword added successfully";
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while adding keyword",
      };
      return res.status(500).send(errResponse);
    }
  }

  async getAllKeywords(req: Request, res: Response): Promise<Response> {
    try {
      const data = await KeywordModel.getAll();
      const succResponse: ResponseInterface<typeof data> = {
        result: true,
        message: "Data fetched successfully",
        data: data,
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting keywords",
      };
      return res.status(500).send(errResponse);
    }
  }

  async deleteKeyword(req: Request, res: Response): Promise<Response> {
    try {
      const keywordId = parseInt(req.params.keywordId);
      const keywordExist = await KeywordModel.getById(keywordId);
      if (keywordExist) {
        await KeywordModel.delete(keywordId);
        const succResponse: ResponseInterface<void> = {
          result: true,
          message: "Keyword deleted successfully",
        };
        return res.status(200).send(succResponse);
      } else {
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message: "Keyword not found",
        };
        return res.status(200).send(errResponse);
      }
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while deleting keyword",
      };
      return res.status(500).send(errResponse);
    }
  }
}
