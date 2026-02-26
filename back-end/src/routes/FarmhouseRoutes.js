import express from "express";
import { FarmhouseCreate, ViewFarmhouses, EditFarmhouse, UpdateFarmhouse, SoftDeleteFarmhouse, updateStatus } from "../controllers/FarmhouseController.js";
import ImageUpload from "../middleware/ImageUpload.js";

const router = express.Router();

router.post("/create-farmhouse", ImageUpload.fields([{ name: "images", maxCount: 10 }, { name: "video", maxCount: 1 }]), FarmhouseCreate);
router.get("/view-farmhouses", ViewFarmhouses);
router.get("/view-farmhouses/:id", EditFarmhouse);
router.put(
	"/update-farmhouse/:id",
	ImageUpload.fields([{ name: "images", maxCount: 10 }, { name: "video", maxCount: 1 }]),
	UpdateFarmhouse
);
router.delete("/delete-farmhouse/:id", SoftDeleteFarmhouse);
router.put("/update-farmhouse-status/:id", updateStatus);


export default router;