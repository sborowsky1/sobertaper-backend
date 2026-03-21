"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const health_1 = __importDefault(require("./routes/health"));
const releases_1 = __importDefault(require("./routes/releases"));
const downloads_1 = __importDefault(require("./routes/downloads"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: false,
}));
app.use(express_1.default.json());
// Static APK hosting
app.use("/downloads", express_1.default.static(path_1.default.join(__dirname, "public", "downloads")));
app.use("/api/health", health_1.default);
app.use("/api/releases", releases_1.default);
app.use("/api/download", downloads_1.default);
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
