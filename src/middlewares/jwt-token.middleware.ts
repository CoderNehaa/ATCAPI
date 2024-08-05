import jwt from "jsonwebtoken";
import { config } from "../config/config";

const generateToken = (userId:number, email:string, expiryTime:string) => {
    return jwt.sign({ userId: userId, email: email }, config.JWT_SECRET, {
        expiresIn: expiryTime,
      });
    }


export default generateToken;

