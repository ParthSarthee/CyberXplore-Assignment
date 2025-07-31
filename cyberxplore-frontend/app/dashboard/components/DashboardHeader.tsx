import { RefreshCw, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
	lastRefresh: Date;
	isRefreshing: boolean;
	apiError: boolean;
}

export function DashboardHeader({
	lastRefresh,
	isRefreshing,
	apiError,
}: DashboardHeaderProps) {
	const router = useRouter();

	return (
		<div className="mb-8">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
					<p className="text-gray-600">Monitor file scan results</p>
				</div>
				<button
					onClick={() => router.push("/")}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					<Upload className="h-4 w-4 mr-2" />
					Upload Files
				</button>
			</div>

			{/* Auto-refresh indicator */}
			<div className="flex items-center justify-between mb-4">
				<div
					suppressHydrationWarning
					className="flex items-center text-sm text-gray-500"
				>
					<RefreshCw
						className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
					/>
					Last updated: {lastRefresh.toLocaleTimeString()}
					{apiError && (
						<span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
							Using offline data
						</span>
					)}
				</div>
				<div className="text-sm text-gray-500">
					Auto-refresh every 5 seconds
				</div>
			</div>
		</div>
	);
}
