import express from "express";
import { FarmhouseCreate, ViewFarmhouses } from "../controllers/FarmhouseController.js";
import protect from "../middleware/Auth.js";

const router = express.Router();

router.post("/create-farmhouse", protect, FarmhouseCreate);
router.get("/view-farmhouses", ViewFarmhouses);


export default router;