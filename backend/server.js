import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import journalRoutes from "./routes/journal.js";
import habitRoutes from './routes/habits.js'

dotenv.config();

const app = express();

/* Middleware */
app.use(cors({
  origin: ['http://localhost:5173', 'https://serenspace-zeta.vercel.app'],
  credentials: true
}));
app.use(express.json());
/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/journal", journalRoutes);
app.use('/api/habits', habitRoutes)

/* Test route */
app.get("/", (req, res) => {
  res.json({ message: "SerenSpace API running 🌿" });
});

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
  });