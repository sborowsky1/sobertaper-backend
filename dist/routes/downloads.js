"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
console.log("downloads route loaded");
function readManifest() {
    const manifestPath = path_1.default.join(process.cwd(), "src", "data", "manifest.json");
    const manifestRaw = fs_1.default.readFileSync(manifestPath, "utf8");
    return JSON.parse(manifestRaw);
}
router.get("/manifest", (_req, res) => {
    try {
        const manifest = readManifest();
        const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4000";
        res.json({
            ...manifest,
            downloadUrl: manifest.downloadPath
                ? `${publicBaseUrl}${manifest.downloadPath}`
                : "",
        });
    }
    catch (error) {
        console.error("Failed to read manifest.json:", error);
        res.status(500).json({ error: "Failed to load download manifest" });
    }
});
router.post("/request", (_req, res) => {
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
    }
    catch (error) {
        console.error("Failed to process download request:", error);
        res.status(500).json({ error: "Failed to process download request" });
    }
});
exports.default = router;
