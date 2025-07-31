import { Shield, AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { StatsProps } from "../types";

export function StatsCards({ statusCounts }: StatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center">
					<div className="p-2 bg-green-100 rounded-lg">
						<Shield className="h-6 w-6 text-green-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">Clean</p>
						<p className="text-2xl font-bold text-gray-900">
							{statusCounts.clean || 0}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center">
					<div className="p-2 bg-red-100 rounded-lg">
						<AlertTriangle className="h-6 w-6 text-red-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">Infected</p>
						<p className="text-2xl font-bold text-gray-900">
							{statusCounts.infected || 0}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center">
					<div className="p-2 bg-blue-100 rounded-lg">
						<RefreshCw className="h-6 w-6 text-blue-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">Scanning</p>
						<p className="text-2xl font-bold text-gray-900">
							{statusCounts.scanning || 0}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center">
					<div className="p-2 bg-yellow-100 rounded-lg">
						<Clock className="h-6 w-6 text-yellow-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">Pending</p>
						<p className="text-2xl font-bold text-gray-900">
							{statusCounts.pending || 0}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
