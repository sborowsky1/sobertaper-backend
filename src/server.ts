import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import healthRoute from "./routes/health";
import releasesRoute from "./routes/releases";
import downloadsRoute from "./routes/downloads";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://sobertaper.com",
  "https://www.sobertaper.com",
  "https://sobertaper-frontend.pages.dev",
];

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

app.use(
  "/downloads",
  express.static(path.join(process.cwd(), "src", "public", "downloads"))
);


app.use("/api/health", healthRoute);
app.use("/api/releases", releasesRoute);
app.use("/api/download", downloadsRoute);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});