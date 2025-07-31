import { Worker } from "bullmq";
import { readFile } from "fs/promises";
import mongoose from "mongoose";
import Metadata from "../models/MetadataModel.ts";

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/file-scanner")
	.then(() => console.log("Worker connected to MongoDB"))
	.catch((error) => {
		console.error("Worker MongoDB connection error:", error);
		process.exit(1);
	});

// Create a worker
const worker = new Worker(
	"file-scanning",
	async (job) => {
		const { fileId, filePath } = job.data;

		try {
			// Update progress
			await job.updateProgress(10);

			// Simulate scanning delay (2-5 seconds)
			const delay = Math.floor(Math.random() * 3000) + 2000;
			await new Promise((resolve) => setTimeout(resolve, delay));

			await job.updateProgress(30);

			// Read file content
			const content = await readFile(filePath, "utf-8");

			await job.updateProgress(60);

			// Check for dangerous keywords
			const dangerousKeywords = ["rm -rf", "eval", "bitcoin"];
			const isInfected = dangerousKeywords.some((keyword) =>
				content.toLowerCase().includes(keyword.toLowerCase())
			);

			await job.updateProgress(80);

			// Update metadata
			await Metadata.findByIdAndUpdate(fileId, {
				status: "scanned",
				result: isInfected ? "infected" : "clean",
				scannedAt: new Date(),
			});

			// If infected, send webhook notification (optional feature)
			if (isInfected && process.env.WEBHOOK_URL) {
				await fetch(process.env.WEBHOOK_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						text: `Malware detected in file: ${filePath}`,
						filename: filePath,
						scannedAt: new Date(),
					}),
				});
			}

			await job.updateProgress(100);
			return { success: true, result: isInfected ? "infected" : "clean" };
		} catch (error) {
			console.error("Error processing file:", error);
			throw error;
		}
	},
	{
		//Redis connection options
		connection: {
			host: process.env.REDIS_HOST || "localhost",
			port: parseInt(process.env.REDIS_PORT || "6379"),
		},
		concurrency: 2, // Process up to 5 files simultaneously
		removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
		removeOnFail: { count: 100 }, // Keep last 100 failed jobs
	}
);

// Handle worker events
worker.on("completed", (job) => {
	console.log(`Job ${job.id} completed. File: ${job.data.filePath}`);
});

worker.on("failed", (job, err) => {
	console.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
	console.error("Worker error:", err);
});

console.log("File scanning worker started...");
