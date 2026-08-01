import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { success } from "zod";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//API Routes
import healthRouter from "./routers/health.routes.js"
import authRouter from "./routers/auth.routers.js"

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);



app.get("/", (_req, res) => {
    res.send("Hello");
})

export default app;