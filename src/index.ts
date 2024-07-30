import express from 'express';
import passport from 'passport';
import swaggerUi, { serve } from 'swagger-ui-express';
import session from 'express-session';
import dotenv from 'dotenv';
import router from './routes/index';
import swaggerDoc from '../swagger.json';
import "./passport";

dotenv.config();
// Loads .env file contents into process.env by default.

const server = express();
const PORT = 3200;

server.use(session({
  secret: process.env.SESSION_SECRET || 'PnTb7zGKJc',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

//Intializes Passport for incoming requests, allowing authentication strategies to be applied.
server.use(passport.initialize());

//Middleware that will restore login state from a session.
server.use(passport.session());

server.use(express.json());

server.use('/', router);
server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// express handler middleware here

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
