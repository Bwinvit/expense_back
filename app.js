import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./DB/Function/Connector.js";
import userRouter from "./routers/Users/users.js";

const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;

if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
} else {
    console.log("⚠️  No.env file found. Using environment variables instead.");
    process.exit(1);
}

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    console.log(`🥊🥊🥊${req.method} request for '${req.url}'`);
    next();
});

app.use(express.json());

app.use('/api/user', userRouter)

connectDB()
    .then((db) => {
        console.log("🥭🥭🥭Connected to MongoDB🥭🥭🥭");

        app.listen(port, () => {
            console.log(
                `🔥🔥🔥Example app listening at http://localhost:${port}🔥🔥🔥`
            );
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });

process.on("SIGINT", () => {
    disconnectDB().then(() => {
        console.log("👋👋👋Disconnected from MongoDB👋👋👋");
        process.exit(0);
    });
});
