import "./passport";
import cors from "cors";
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import router from './routes/index';
import swaggerDoc from '../swagger.json';
import { config } from './config/config';
import cookieParser from "cookie-parser";
const server = express();
const PORT = 3200;

server.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: config.NODE_ENV === 'production' },
}));

server.use(cors({
  origin:"http://localhost:3000",
  credentials:true,
  methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders:['Content-Type', 'Authorization']
}));

//Intializes Passport for incoming requests, allowing authentication strategies to be applied.
server.use(passport.initialize());

//Middleware that will restore login state from a session.
server.use(passport.session());
server.use(cookieParser())
server.use(express.json());

server.use('/', router);
server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


// express handler middleware here

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

