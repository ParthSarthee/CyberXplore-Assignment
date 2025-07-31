"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
	DashboardHeader,
	FileDetailsModal,
	FileTable,
	Pagination,
	StatsCards,
	StatusFilter,
} from "./components";
import { ScanFile } from "./types";

const mockFiles: ScanFile[] = [
	{
		id: "1",
		filename: "document.pdf",
		timestamp: "2024-01-15 14:30:22",
		status: "scanned",
		result: "clean",
	},
	// ... other mock files
];

const fetchFilesFromAPI = async (): Promise<ScanFile[]> => {
	try {
		const response = await fetch("http://localhost:8000/files");
		if (response.ok) {
			const data = await response.json();
			return data.map((file: any) => ({
				id: file._id || Math.random().toString(36).substr(2, 9),
				filename: file.filename || file.name,
				timestamp:
					file.timestamp ||
					new Date().toISOString().replace("T", " ").substr(0, 19),
				status: file.status || "pending",
				result: file.result || "pending",
			}));
		} else {
			throw new Error("Failed to fetch files");
		}
	} catch (error) {
		console.error("API Error:", error);
		return mockFiles;
	}
};

export default function DashboardPage() {
	const [files, setFiles] = useState<ScanFile[]>([]);
	const [lastRefresh, setLastRefresh] = useState(new Date());
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [apiError, setApiError] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [selectedFile, setSelectedFile] = useState<ScanFile | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [previousFiles, setPreviousFiles] = useState<ScanFile[]>([]);

	// Initial load
	useEffect(() => {
		const loadFiles = async () => {
			setIsLoading(true);
			try {
				const fetchedFiles = await fetchFilesFromAPI();
				setFiles(fetchedFiles);
				setApiError(false);
			} catch (error) {
				console.error("Failed to load files:", error);
				setFiles(mockFiles);
				setApiError(true);
			} finally {
				setIsLoading(false);
			}
		};

		loadFiles();
	}, []);

	// Auto-refresh every 5 seconds
	useEffect(() => {
		const interval = setInterval(async () => {
			setIsRefreshing(true);

			try {
				const fetchedFiles = await fetchFilesFromAPI();
				setFiles(fetchedFiles);
				setApiError(false);
			} catch (error) {
				console.error("Refresh error:", error);
				setApiError(true);
			}

			setLastRefresh(new Date());
			setTimeout(() => setIsRefreshing(false), 500);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// Track file status changes for toast notifications
	useEffect(() => {
		if (previousFiles.length === 0) {
			setPreviousFiles(files);
			return;
		}

		// Check for status changes
		files.forEach((currentFile) => {
			const previousFile = previousFiles.find((f) => f.id === currentFile.id);

			if (previousFile && previousFile.status !== currentFile.status) {
				if (currentFile.result === "clean") {
					toast.success(`${currentFile.filename} is clean and safe to use.`, {
						duration: 6000,
					});
				} else if (currentFile.result === "infected") {
					toast.error(`${currentFile.filename} contains malicious content.`, {
						duration: 8000,
					});
				} else if (currentFile.status === "scanning") {
					toast.loading(`Now scanning ${currentFile.filename}...`, {
						duration: 4000,
					});
				}
			}
		});

		// Check for new files
		const newFiles = files.filter(
			(file) => !previousFiles.some((f) => f.id === file.id)
		);
		newFiles.forEach((newFile) => {
			if (newFile.status === "pending") {
				toast(`${newFile.filename} has been queued for scanning.`, {
					icon: "ℹ️",
					duration: 4000,
				});
			}
		});

		setPreviousFiles(files);
	}, [files, previousFiles]);

	const filteredFiles = files.filter((file) => {
		if (statusFilter === "all") return true;
		return file.status === statusFilter;
	});

	// Pagination calculations
	const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

	// Reset to first page when filter changes
	useEffect(() => {
		setCurrentPage(1);
	}, [statusFilter]);

	const statusCounts = filteredFiles.reduce((acc, file) => {
		acc[file.status] = (acc[file.status] || 0) + 1;
		file.result !== "pending" &&
			(acc[file.result] = (acc[file.result] || 0) + 1);
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				<DashboardHeader
					lastRefresh={lastRefresh}
					isRefreshing={isRefreshing}
					apiError={apiError}
				/>

				<StatsCards statusCounts={statusCounts} />

				<StatusFilter
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					files={files}
					totalFiles={files.length}
				/>

				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h3 className="text-lg font-medium text-gray-900">
							Uploaded Files
						</h3>
					</div>

					<FileTable
						files={paginatedFiles}
						isLoading={isLoading}
						onViewDetails={(file) => setSelectedFile(file)}
					/>

					{totalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							itemsPerPage={itemsPerPage}
							totalItems={filteredFiles.length}
							startIndex={startIndex}
							endIndex={endIndex}
							setItemsPerPage={setItemsPerPage}
							setCurrentPage={setCurrentPage}
						/>
					)}
				</div>

				{selectedFile && (
					<FileDetailsModal
						file={selectedFile}
						onClose={() => setSelectedFile(null)}
					/>
				)}
			</div>
		</div>
	);
}
