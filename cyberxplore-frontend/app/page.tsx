"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface UploadFile {
	file: File;
	progress: number;
	status: "uploading" | "scanning" | "complete";
}

export default function FileUploadPage() {
	const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const router = useRouter();

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const uploadFileToAPI = async (file: File) => {
		const uploadFile: UploadFile = {
			file,
			progress: 0,
			status: "uploading",
		};

		setUploadFiles((prev) => [...prev, uploadFile]);

		let progressInterval: NodeJS.Timeout | null = null;

		try {
			const formData = new FormData();
			formData.append("file", file);

			// Simulate progress during upload
			progressInterval = setInterval(() => {
				setUploadFiles((prev) =>
					prev.map((uf) => {
						if (uf.file === file && uf.progress < 90) {
							return { ...uf, progress: uf.progress + 10 };
						}
						return uf;
					})
				);
			}, 200);

			const response = await fetch("http://localhost:8000/upload", {
				method: "POST",
				body: formData,
			});

			clearInterval(progressInterval);

			const responseData = await response.json();

			if (response.ok) {
				// Complete upload progress
				setUploadFiles((prev) =>
					prev.map((uf) =>
						uf.file === file ? { ...uf, progress: 100, status: "scanning" } : uf
					)
				);

				// Show success toast
				toast.success(
					`${file.name} uploaded successfully and queued for scanning.`,
					{
						duration: 5000,
					}
				);

				// Update status based on metadata from backend
				setTimeout(() => {
					setUploadFiles((prev) =>
						prev.map((uf) =>
							uf.file === file ? { ...uf, status: "complete" } : uf
						)
					);
				}, 2000);
			} else {
				const errorMessage = responseData.error || "Upload failed";
				throw new Error(errorMessage);
			}
		} catch (error) {
			console.error("Upload error:", error);

			// Show error toast with specific message
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			toast.error(`Failed to upload ${file.name}: ${errorMessage}`, {
				duration: 6000,
			});

			// Remove the failed upload from the list
			setUploadFiles((prev) => prev.filter((uf) => uf.file !== file));
		}
	};

	// Keep the original simulateUpload function as fallback
	const simulateUpload = (file: File) => {
		// Only add the file if it doesn't already exist in uploadFiles
		setUploadFiles((prev) => {
			const alreadyExists = prev.some((uf) => uf.file === file);
			if (!alreadyExists) {
				const uploadFile: UploadFile = {
					file,
					progress: 0,
					status: "uploading",
				};
				return [...prev, uploadFile];
			}
			return prev;
		});

		// Simulate upload progress
		const interval = setInterval(() => {
			setUploadFiles((prev) =>
				prev.map((uf) => {
					if (uf.file === file) {
						if (uf.progress >= 100) {
							clearInterval(interval);
							return { ...uf, status: "scanning" };
						}
						return { ...uf, progress: uf.progress + 10 };
					}
					return uf;
				})
			);
		}, 200);

		// Simulate scan completion
		setTimeout(() => {
			setUploadFiles((prev) =>
				prev.map((uf) =>
					uf.file === file ? { ...uf, status: "complete" } : uf
				)
			);
		}, 3000);
	};

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		files.forEach(uploadFileToAPI);
	}, []);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		files.forEach(uploadFileToAPI);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">File Upload</h1>
					<p className="text-gray-600">Upload files for virus scanning</p>
				</div>

				{/* Upload Area */}
				<div
					className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
						isDragOver
							? "border-blue-400 bg-blue-50"
							: "border-gray-300 bg-white hover:border-gray-400"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Drop files here or click to upload
					</h3>
					<p className="text-gray-500 mb-4">
						Supports PDF, DOCX, and image files (JPG, PNG) up to 5MB
					</p>
					<input
						type="file"
						multiple
						onChange={handleFileInput}
						className="hidden"
						id="file-input"
					/>
					<label
						htmlFor="file-input"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
					>
						Choose Files
					</label>
				</div>

				{/* Upload Progress */}
				{uploadFiles.length > 0 && (
					<div className="mt-8 bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Upload Progress
						</h3>
						<div className="space-y-4">
							{uploadFiles.map((uploadFile, index) => (
								<div key={index} className="border rounded-lg p-4">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center">
											<FileText className="h-5 w-5 text-gray-400 mr-2" />
											<span className="text-sm font-medium text-gray-900">
												{uploadFile.file.name}
											</span>
										</div>
										<span className="text-sm text-gray-500">
											{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
										</span>
									</div>

									{uploadFile.status === "uploading" && (
										<>
											<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all duration-300"
													style={{ width: `${uploadFile.progress}%` }}
												></div>
											</div>
											<p className="text-sm text-gray-600">
												Uploading... {uploadFile.progress}%
											</p>
										</>
									)}

									{uploadFile.status === "scanning" && (
										<div className="flex items-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
											<p className="text-sm text-blue-600 font-medium">
												Scan in progress...
											</p>
										</div>
									)}

									{uploadFile.status === "complete" && (
										<div className="flex items-center">
											<div className="h-4 w-4 bg-green-500 rounded-full mr-2"></div>
											<p className="text-sm text-green-600 font-medium">
												Upload complete
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Navigation */}
				<div className="mt-8 flex justify-between">
					<button
						onClick={() => router.push("/dashboard")}
						className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						View Dashboard
					</button>
				</div>
			</div>
		</div>
	);
}
