"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
console.log("releases route loaded");
router.get("/latest", (_req, res) => {
    try {
        const releasesPath = path_1.default.join(process.cwd(), "src", "data", "releases.json");
        const releasesRaw = fs_1.default.readFileSync(releasesPath, "utf8");
        const release = JSON.parse(releasesRaw);
        res.json(release);
    }
    catch (error) {
        console.error("Failed to read releases.json:", error);
        res.status(500).json({ error: "Failed to load latest release metadata" });
    }
});
exports.default = router;
