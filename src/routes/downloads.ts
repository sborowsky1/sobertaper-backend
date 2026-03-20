import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();

function readManifest() {
  const manifestPath = path.join(process.cwd(), "src", "data", "manifest.json");
  const manifestRaw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(manifestRaw);
}

function getBetaCodes(): string[] {
  return String(process.env.BETA_CODES || "")
    .split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

router.get("/manifest", (_req: Request, res: Response) => {
  try {
    const manifest = readManifest();
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4000";

    const downloadUrl = manifest.downloadPath
      ? `${publicBaseUrl}${manifest.downloadPath}`
      : "";

    res.json({
      ...manifest,
      downloadUrl,
    });
  } catch (error) {
    console.error("Failed to read manifest.json:", error);
    res.status(500).json({ error: "Failed to load download manifest" });
  }
});

router.post("/request", (req: Request, res: Response) => {
  try {
    const manifest = readManifest();
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4000";

    const downloadUrl = manifest.downloadPath
      ? `${publicBaseUrl}${manifest.downloadPath}`
      : "";

    const submittedCode =
      typeof req.body?.code === "string"
        ? req.body.code.trim().toUpperCase()
        : "";

    const validCodes = getBetaCodes();

    if (!submittedCode) {
      return res.status(200).json({
        allowed: false,
        message: "Please enter a beta access code.",
        downloadUrl: "",
      });
    }

    const codeAccepted = validCodes.includes(submittedCode);

    if (!codeAccepted) {
      return res.status(200).json({
        allowed: false,
        message: "Invalid beta access code.",
        downloadUrl: "",
      });
    }

    if (!manifest.downloadAvailable) {
      return res.status(200).json({
        allowed: false,
        message: "Download is currently unavailable.",
        downloadUrl: "",
      });
    }

    console.log(
      JSON.stringify({
        event: "beta_download_approved",
        at: new Date().toISOString(),
        version: manifest.version,
        versionCode: manifest.versionCode,
        platform: manifest.platform,
        userAgent: req.get("user-agent") || "",
        ip: req.ip,
      })
    );

    return res.status(200).json({
      allowed: true,
      message: "Beta access approved.",
      downloadUrl,
    });
  } catch (error) {
    console.error("Failed to process download request:", error);
    return res.status(500).json({ error: "Failed to process download request" });
  }
});

export default router;