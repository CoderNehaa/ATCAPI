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
exports.validationMiddleware = void 0;
const { body, validationResult } = require('express-validator');
const validationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. setup rules for validation
    const rules = [
        body('password').isStrongPassword({
            minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, minLength: 6,
        }).withMessage('Passsword must contain one uppercase letter, one lowercase letter, one special character and one numeric digit.'),
        body('password').isLength({ min: 6, max: 12 }).withMessage('Password contains minimum 6 and maximum 12 characters'),
    ];
    // 2. run those rules
    yield Promise.all(rules.map((rule) => rule.run(req)));
    // 3. Check if there are any errors after running the rules
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errrorMesages = validationErrors.errors.map((obj) => obj.msg);
        return res.status(400).send({
            result: false,
            message: errrorMesages,
        });
    }
    next();
});
exports.validationMiddleware = validationMiddleware;
