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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordController = void 0;
const keyword_model_1 = require("../models/keyword.model");
class KeywordController {
    addKeyword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keywordName } = req.body;
            const isPresent = yield keyword_model_1.KeywordModel.keywordNameExists(keywordName);
            const succResponse = {
                result: false,
                message: "",
            };
            if (isPresent) {
                succResponse.message = "Keyword already exists";
                return res.status(400).send(succResponse);
            }
            yield keyword_model_1.KeywordModel.create(keywordName);
            try {
                succResponse.result = true;
                succResponse.message = "Keyword added successfully";
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while adding keyword",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    getAllKeywords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield keyword_model_1.KeywordModel.getAll();
                const succResponse = {
                    result: true,
                    message: "Data fetched successfully",
                    data: data,
                };
                return res.status(200).send(succResponse);
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while getting keywords",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
    deleteKeyword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keywordId = parseInt(req.params.keywordId);
                const keywordExist = yield keyword_model_1.KeywordModel.getById(keywordId);
                if (keywordExist) {
                    yield keyword_model_1.KeywordModel.delete(keywordId);
                    const succResponse = {
                        result: true,
                        message: "Keyword deleted successfully",
                    };
                    return res.status(200).send(succResponse);
                }
                else {
                    const errResponse = {
                        result: false,
                        message: "Keyword not found",
                    };
                    return res.status(200).send(errResponse);
                }
            }
            catch (e) {
                console.log(e);
                const errResponse = {
                    result: false,
                    message: "Error occurred while deleting keyword",
                };
                return res.status(500).send(errResponse);
            }
        });
    }
}
exports.KeywordController = KeywordController;
