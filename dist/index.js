"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./src/passport");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_session_1 = __importDefault(require("express-session"));
const index_1 = __importDefault(require("./src/routes/index"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const config_1 = require("./src/config/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const PORT = 3200;
const server = (0, express_1.default)();
const httpServer = http_1.default.createServer(server);
//socket.io Server requires httpServer
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        credentials: true
    }
});
server.use((0, express_session_1.default)({
    secret: config_1.config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config_1.config.NODE_ENV === 'production' },
}));
server.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//socket events
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('sendMessage', (data) => {
        socket.to(data.chatId).emit('receiveMessage', data);
    });
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
//Intializes Passport for incoming requests, allowing authentication strategies to be applied.
server.use(passport_1.default.initialize());
//Middleware that will restore login state from a session.
server.use(passport_1.default.session());
server.use('/', index_1.default);
server.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// error handler middleware here
httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
