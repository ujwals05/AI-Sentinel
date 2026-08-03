import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5176"],
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//API Routes
import router from "./routers/index.js";
app.use("/api", router);



app.get("/", (_req, res) => {
    res.send("Hello");
});

app.use(errorMiddleware);

export default app;