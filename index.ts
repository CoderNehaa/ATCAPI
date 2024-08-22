import "./src/passport";
import cors from "cors";
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import router from './src/routes/index';
import swaggerDoc from './swagger.json';
import { config } from './src/config/config';
import cookieParser from "cookie-parser";
import {Server} from "socket.io";
import http from "http"
const PORT = 3200;

const server = express();

const httpServer = http.createServer(server);
//socket.io Server requires httpServer
const io = new Server(httpServer, {
  cors:{
    origin:"http://localhost:3000",
    methods:['GET', 'POST'],
    credentials:true
  }
});

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


//socket events
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (data) => {
    socket.to(data.chatId).emit('receiveMessage', data);
  })  

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
})

server.use(express.json());
server.use(cookieParser())


//Intializes Passport for incoming requests, allowing authentication strategies to be applied.
server.use(passport.initialize());

//Middleware that will restore login state from a session.
server.use(passport.session());

server.use('/', router);
server.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


// error handler middleware here
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

