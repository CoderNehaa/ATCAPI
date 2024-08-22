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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSender = (emailAddress, userName, randomPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(emailAddress, userName);
    // 1. create an email transporter
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'nagdaneha97@gmail.com',
            pass: 'yete ksxe jsem cjvf',
        },
    });
    // 2. declare email content
    const mailOptions = {
        from: 'nagdaneha97@gmail.com',
        to: emailAddress,
        subject: 'login with this temporary password',
        text: `Hello ${userName}, restore your account with this temporary password (${randomPassword}), 
    and then choose password of your choice once you sign in`,
    };
    // 3. Send email
    try {
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.default = mailSender;
