import {
	AlertTriangle,
	Clock,
	Eye,
	FileText,
	RefreshCw,
	Shield,
} from "lucide-react";
import { ScanFile } from "../types";

interface FileTableProps {
	files: ScanFile[];
	isLoading: boolean;
	onViewDetails: (file: ScanFile) => void;
}

export function getStatusIcon(status: string) {
	switch (status) {
		case "clean":
			return <Shield className="h-5 w-5 text-green-500" />;
		case "infected":
			return <AlertTriangle className="h-5 w-5 text-red-500" />;
		case "scanning":
			return (
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
			);
		case "pending":
			return <Clock className="h-5 w-5 text-yellow-500" />;
		default:
			return <FileText className="h-5 w-5 text-gray-400" />;
	}
}

export function getStatusColor(status: string) {
	switch (status) {
		case "clean":
			return "bg-green-100 text-green-800";
		case "infected":
			return "bg-red-100 text-red-800";
		case "scanning":
			return "bg-blue-100 text-blue-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

export function getRowColor(status: string) {
	switch (status) {
		case "clean":
			return "border-l-4 border-l-green-500 bg-green-50";
		case "infected":
			return "border-l-4 border-l-red-500 bg-red-50";
		case "scanning":
			return "border-l-4 border-l-blue-500 bg-blue-50";
		case "pending":
			return "border-l-4 border-l-yellow-500 bg-yellow-50";
		default:
			return "bg-white";
	}
}

export function FileTable({ files, isLoading, onViewDetails }: FileTableProps) {
	if (isLoading) {
		return (
			<div className="px-6 py-12 text-center">
				<RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
				<p className="text-gray-500">Loading files...</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Filename
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Timestamp
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Result
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{files.map((file) => (
						<tr
							key={file.id}
							className={`${getRowColor(
								file.status
							)} hover:bg-opacity-75 transition-colors`}
						>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									<FileText className="h-5 w-5 text-gray-400 mr-3" />
									<div className="text-sm font-medium text-gray-900">
										{file.filename}
									</div>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{file.timestamp}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									{getStatusIcon(file.status)}
									<span
										className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
											file.status
										)}`}
									>
										{file.status.charAt(0).toUpperCase() + file.status.slice(1)}
									</span>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									{getStatusIcon(file.result)}
									<span
										className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
											file.result
										)}`}
									>
										{file.result.charAt(0).toUpperCase() + file.result.slice(1)}
									</span>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<button
									onClick={() => onViewDetails(file)}
									className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
								>
									<Eye className="h-4 w-4 mr-1" />
									View Details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
