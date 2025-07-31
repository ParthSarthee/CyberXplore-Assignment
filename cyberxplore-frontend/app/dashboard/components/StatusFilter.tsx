import { Filter } from "lucide-react";
import { FilterProps } from "../types";

export function StatusFilter({
	statusFilter,
	setStatusFilter,
	files,
	totalFiles,
}: FilterProps) {
	return (
		<div className="mb-6">
			<div className="flex items-center gap-4">
				<div className="flex items-center">
					<Filter className="h-5 w-5 text-gray-400 mr-2" />
					<span className="text-sm font-medium text-gray-700">
						Filter by status:
					</span>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => setStatusFilter("all")}
						className={`px-3 py-1 text-sm rounded-full transition-colors ${
							statusFilter === "all"
								? "bg-gray-800 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						All ({totalFiles})
					</button>
					<button
						onClick={() => setStatusFilter("clean")}
						className={`px-3 py-1 text-sm rounded-full transition-colors ${
							statusFilter === "clean"
								? "bg-green-600 text-white"
								: "bg-green-100 text-green-700 hover:bg-green-200"
						}`}
					>
						Clean ({files.filter((f) => f.result === "clean").length})
					</button>
					<button
						onClick={() => setStatusFilter("infected")}
						className={`px-3 py-1 text-sm rounded-full transition-colors ${
							statusFilter === "infected"
								? "bg-red-600 text-white"
								: "bg-red-100 text-red-700 hover:bg-red-200"
						}`}
					>
						Infected ({files.filter((f) => f.result === "infected").length})
					</button>
					<button
						onClick={() => setStatusFilter("scanning")}
						className={`px-3 py-1 text-sm rounded-full transition-colors ${
							statusFilter === "scanning"
								? "bg-blue-600 text-white"
								: "bg-blue-100 text-blue-700 hover:bg-blue-200"
						}`}
					>
						Scanning ({files.filter((f) => f.status === "scanning").length})
					</button>
					<button
						onClick={() => setStatusFilter("pending")}
						className={`px-3 py-1 text-sm rounded-full transition-colors ${
							statusFilter === "pending"
								? "bg-yellow-600 text-white"
								: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
						}`}
					>
						Pending ({files.filter((f) => f.status === "pending").length})
					</button>
				</div>
			</div>
		</div>
	);
}
