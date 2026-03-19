import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

console.log("downloads route loaded");

function readManifest() {
  const manifestPath = path.join(__dirname, "..", "data", "manifest.json");
  const manifestRaw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(manifestRaw);
}

router.get("/manifest", (_req: Request, res: Response) => {
  try {
    const manifest = readManifest();
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4000";

    res.json({
      ...manifest,
      downloadUrl: manifest.downloadPath
        ? `${publicBaseUrl}${manifest.downloadPath}`
        : "",
    });
  } catch (error) {
    console.error("Failed to read manifest.json:", error);
    res.status(500).json({ error: "Failed to load download manifest" });
  }
});

router.post("/request", (_req: Request, res: Response) => {
  try {
    const manifest = readManifest();
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4000";
    const downloadUrl = manifest.downloadPath
      ? `${publicBaseUrl}${manifest.downloadPath}`
      : "";

    res.json({
      allowed: !!manifest.downloadAvailable,
      message: manifest.downloadAvailable
        ? "Download request accepted"
        : "Download is currently unavailable",
      downloadUrl: manifest.downloadAvailable ? downloadUrl : "",
    });
  } catch (error) {
    console.error("Failed to process download request:", error);
    res.status(500).json({ error: "Failed to process download request" });
  }
});

export default router;