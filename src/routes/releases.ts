import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

console.log("releases route loaded");

router.get("/latest", (_req: Request, res: Response) => {
  try {
    const releasesPath = path.join(__dirname, "..", "data", "releases.json");
    const releasesRaw = fs.readFileSync(releasesPath, "utf8");
    const release = JSON.parse(releasesRaw);

    res.json(release);
  } catch (error) {
    console.error("Failed to read releases.json:", error);
    res.status(500).json({ error: "Failed to load latest release metadata" });
  }
});

export default router;