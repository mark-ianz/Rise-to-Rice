import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user";
import announcementRoutes from "./routes/announcement";
import exchangeRoutes from "./routes/exchange";
import materialRoutes from "./routes/material";
import authRoutes from "./routes/auth";
import pointsRoutes from "./routes/points";
import analyticsRoutes from "./routes/analytics";
import refreshTokenRoutes from "./routes/refresh-token";
import { requireAuth } from "./middleware/authentication";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contact-us";
import rewardRoutes from "./routes/reward";
import rewardVariationRoutes from "./routes/reward-variation";
import redeemRequestRoutes from "./routes/redeem-request";
import testRoutes from "./routes/test";
import reactionsRoutes from "./routes/reactions";
import cors from "cors";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

console.log(corsOptions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, HOST, () => {
  console.log(`Hosting on ${HOST} and listening to PORT ${PORT}`);
});


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/points", requireAuth, pointsRoutes);
app.use("/api/refresh-token", refreshTokenRoutes);
app.use("/api/contact-us", contactRoutes);
app.use("/api/reward", rewardRoutes);
app.use("/api/reward-variation", rewardVariationRoutes);
app.use("/api/redeem-request", requireAuth, redeemRequestRoutes);
app.use("/api/reactions", requireAuth, reactionsRoutes);
app.use("/api/test", testRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
  return;
});
