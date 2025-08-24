// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import helmet from 'helmet'
// import { redisClient } from "./config/redis.js";
// import { pool } from "./config/database.js";
// import cookieParser from "cookie-parser";
// const PORT = process.env.PORT || 3000;
// import authRouter from "./routes/auth.route.js";
// import analyticsRouter from "./routes/analyticsRoutes.route.js";
// import transactionRouter from "./routes/transactionRoutes.route.js";
// const app = express();
// app.use(helmet())
// app.use(express.json());
// const corsOptions = {
//   origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(cookieParser())
// redisClient.on('error', err => console.error('Redis error:', err));
// app.use("/api/auth", authRouter)
// app.use("/api/analytics",analyticsRouter)
// app.use("/api/transactions", transactionRouter)
// pool.getConnection()
//   .then(conn => {
//     console.log('MySQL connected');
//     conn.release();
//   })
//   .catch(err => console.error('DB connection error:', err));
// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`)
// })





import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Import configs
import { redisClient } from "./config/redis.js";
import { pool } from "./config/database.js";

// Import routes
import authRouter from "./routes/auth.route.js";
import analyticsRouter from "./routes/analyticsRoutes.route.js";
import transactionRouter from "./routes/transactionRoutes.route.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Redis events
redisClient.on("error", (err) => console.error("Redis error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/transactions", transactionRouter);

// ✅ PostgreSQL connection check
pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL connected");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Exit if DB fails
  });
