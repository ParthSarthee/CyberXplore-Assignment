import express from "express";
import multer from "multer";
import path from "path";
import Metadata from "../models/MetadataModel.ts";
import { addFileToScanQueue } from "../queues/fileQueue.ts";

// START - Multer configuration for file uploads
const storage = multer.diskStorage({
	destination: "./uploads/",
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (
	req: express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	const allowedTypes = [".pdf", ".docx", ".jpg", ".jpeg", ".png"];
	const ext = path.extname(file.originalname).toLowerCase();

	if (allowedTypes.includes(ext)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				"Invalid file type. Only PDF, DOCX, JPG and PNG files are allowed."
			)
		);
	}
};

const multerUploader = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});
// END -Multer configuration for file uploads

const router = express.Router();
// POST /upload - File Upload endpoint
router.post("/", multerUploader.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const metadata = new Metadata({
			filename: req.file.originalname,
			path: req.file.path,
			status: "pending",
			uploadedAt: new Date(),
		});

		await metadata.save();

		// Add to scan queue
		await addFileToScanQueue(metadata._id.toString(), metadata.path);

		res.status(201).json(metadata);
	} catch (error) {
		res.status(500).json({ error: "Error uploading file" });
	}
});

export default router;
