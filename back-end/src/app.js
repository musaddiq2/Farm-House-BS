import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import FarmhouseRoutes from "./routes/FarmhouseRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files at /uploads URL (so frontend can request /uploads/<filename>)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/farmhouses", FarmhouseRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("FunFarm API is running 🚜🌿");
});

export { app };
