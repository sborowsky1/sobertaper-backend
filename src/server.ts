import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import healthRoute from "./routes/health";
import releasesRoute from "./routes/releases";
import downloadsRoute from "./routes/downloads";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Important when running behind Render / reverse proxies
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://sobertaper.com",
  "https://www.sobertaper.com",
  "https://sobertaper-frontend.pages.dev",
];

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: false,
  })
);

app.use(express.json());

const downloadRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 attempts per IP per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    allowed: false,
    message: "Too many attempts. Please try again later.",
    downloadUrl: "",
  },
});

app.use(
  "/downloads",
  express.static(path.join(process.cwd(), "src", "public", "downloads"))
);

app.use("/api/health", healthRoute);
app.use("/api/releases", releasesRoute);
app.use("/api/download/request", downloadRequestLimiter);
app.use("/api/download", downloadsRoute);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});