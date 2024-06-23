import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./DB/Function/Connector.js";
import { Router } from "./routers/index.js";
import cors from "cors";

import seedTransactionTypes from "./utils/seedTransactionType.js";
import seedCategories from "./utils/seedCategory.js";

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
app.use(cors());

app.use((req, res, next) => {
  console.log(`🥊🥊🥊${req.method} request for '${req.url}'`);
  next();
});

app.use(express.json());

app.use("/api/user", Router.User);
app.use("/api/auth", Router.Auth);
app.use("/api/naq", Router.NAQ);
app.use("/api/transaction", Router.Transaction);
app.use("/api/category", Router.Category);
app.use("/api/transaction-type", Router.TransactionType);

connectDB()
  .then((db) => {
    console.log("🥭🥭🥭Connected to MongoDB🥭🥭🥭");

    // seedCategories();

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
