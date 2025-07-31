import express from "express";
import Metadata from "../models/MetadataModel.ts";

const router = express.Router();

// GET /files - Fetch all files
router.get("/", async (req, res) => {
	try {
		const files = await Metadata.find().sort({ uploadedAt: -1 });
		res.json(files);
	} catch (error) {
		res.status(500).json({ error: "Error fetching files" });
	}
});

export default router;
