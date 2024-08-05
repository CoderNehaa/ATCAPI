// src/config.ts
import dotenv from "dotenv";

dotenv.config();

interface Config {
  NODE_ENV:string;
  DB_CONNECTION: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  GOOGLE_CLIENTID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FACEBOOK_APPID: string;
  FACEBOOK_SECRET: string;
  FACEBOOK_CALLBACK_URL: string;
  FRONT_END_DOMAIN: string;
  SESSION_SECRET:string
}

const getConfig = (): Config => {
  const {
    NODE_ENV,
    DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    JWT_SECRET,
    GOOGLE_CLIENTID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    FACEBOOK_APPID,
    FACEBOOK_SECRET,
    FACEBOOK_CALLBACK_URL,
    FRONT_END_DOMAIN,
    SESSION_SECRET
  } = process.env;

  if (
    !NODE_ENV ||
    !DB_CONNECTION ||
    !DB_HOST ||
    !DB_PORT ||
    !DB_DATABASE ||
    !DB_USERNAME ||
    !DB_USERNAME ||
    !DB_PASSWORD ||
    !GOOGLE_CLIENTID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_CALLBACK_URL ||
    !FACEBOOK_APPID ||
    !FACEBOOK_SECRET ||
    !FACEBOOK_CALLBACK_URL ||
    !FRONT_END_DOMAIN ||
    !JWT_SECRET || 
    !SESSION_SECRET
  ) {
    throw new Error("Missing required environment variables");
  }

  return {
    NODE_ENV,
    DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    JWT_SECRET,
    GOOGLE_CLIENTID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    FACEBOOK_APPID,
    FACEBOOK_SECRET,
    FACEBOOK_CALLBACK_URL,
    FRONT_END_DOMAIN,
    SESSION_SECRET
  };
};

export const config = getConfig();
