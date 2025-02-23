import express from "express";


const app = express();


//routes import
import authRoutes from "./routes/auth.routes.js";
//routes declaration
app.use('/api/v1/auth', authRoutes);

export { app };