import express from "express";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes import
import authRoutes from "./routes/auth.routes.js";
//routes declaration
app.use('/api/v1/auth', authRoutes);

export { app };