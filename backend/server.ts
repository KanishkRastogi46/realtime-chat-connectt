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

// initializing express app and socket.io server
const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const port: number = Number(process.env.PORT)

// built-in middlewares
app.use(logger("dev"));
app.use(cors({
    origin: ["*"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
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

// api routes
app.use("/api/v1/auth", userRouter);


app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World!"});
})

// starting the server
const startApp =  async function () {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startApp();