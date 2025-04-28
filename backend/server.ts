import {createServer} from "http";
import express, {Express, Request, Response} from "express";
import {Server} from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import session from "express-session";
import {config} from "dotenv";

// loading environment variables from .env
config();

import connectDB from "./src/lib/db";
import userRouter from "./src/routes/users.route"
import chatRouter from "./src/routes/chats.route";

// initializing express app and socket.io server
const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
const port: number = Number(process.env.PORT)

// using map data structure for in-memory storage for online users
var onlineUsers: Map<string, string> = new Map<string, string>();

// built-in middlewares
app.use(logger("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: String(process.env.SECRET),
}))

// Socket.IO Server
io.on("connection", (socket) => {
    // console.log(socket.handshake);
    let username = socket.handshake.query.username as string;
    if (username) onlineUsers.set(username, socket.id);
    console.log(`New client connected: ${socket.id}`);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    socket.on("disconnect", () => {
        onlineUsers.delete(username);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        console.log(`Client disconnected: ${socket.id}`);
    });
})

// api routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/chats", chatRouter);


app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World!"});
})

// starting the server
const startApp =  async function () {
    await connectDB();
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startApp();