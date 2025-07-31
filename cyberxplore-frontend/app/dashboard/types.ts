export interface ScanFile {
	result: "clean" | "infected" | "pending";
	id: string;
	filename: string;
	timestamp: string;
	status: "pending" | "scanning" | "scanned";
}

export interface StatusCounts {
	[key: string]: number;
}

export interface FilterProps {
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	files: ScanFile[];
	totalFiles: number;
}

export interface StatsProps {
	statusCounts: StatusCounts;
}
