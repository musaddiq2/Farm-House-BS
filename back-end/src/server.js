import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./config/database.js";

dotenv.config();
// Server
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })
