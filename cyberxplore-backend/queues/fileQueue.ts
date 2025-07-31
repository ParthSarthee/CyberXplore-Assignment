import { Queue } from "bullmq";

// Create a new queue
export const fileQueue = new Queue("file-scanning", {
	connection: {
		host: process.env.REDIS_HOST || "localhost",
		port: parseInt(process.env.REDIS_PORT || "6379"),
	},
});

// Add the job to the queue
export const addFileToScanQueue = async (fileId: string, filePath: string) => {
	await fileQueue.add(
		"scan",
		{
			fileId,
			filePath,
		},
		{
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 1000,
			},
		}
	);
};
