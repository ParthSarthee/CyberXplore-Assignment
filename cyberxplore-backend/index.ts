import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import filesRoutes from "./routes/files.ts";
import uploadRoutes from "./routes/upload.ts";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Middleware
app.use(cors());

// Debug middleware to log requests
app.use((req, res, next) => {
	console.log(
		`${req.method} ${req.path} - Origin: ${req.headers.origin || "No origin"}`
	);
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/files", filesRoutes);
app.use("/upload", uploadRoutes);

// MongoDB Connection
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/file-scanner";

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("Server connected to MongoDB.");
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	});

// Routes
app.use("/files", filesRoutes);
app.use("/upload", uploadRoutes);

// Error handling middleware
app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error("Error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
);

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
