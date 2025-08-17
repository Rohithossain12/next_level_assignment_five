
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors"
import "./app/config/pasport"
import { envVars } from "./app/config/env";


const app = express();

app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", router);





app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel delivery system Backend"
    })
})



app.use(globalErrorHandler);

app.use(notFound)


export default app