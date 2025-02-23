import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";
dotenv.config();

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR:", error);
            throw error;
        })
        app.listen(process.env.PORT || 80000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("MongoDb connection failed !!!", error)
})