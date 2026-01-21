import express from "express";

import express from "express";
import emailRoutes from "./modules/emails/email.routes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Email routes
app.use("/emails", emailRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

export default app;
