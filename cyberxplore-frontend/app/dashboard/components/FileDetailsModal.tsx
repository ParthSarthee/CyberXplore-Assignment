import { AlertTriangle, Clock, Shield, X } from "lucide-react";
import { ScanFile } from "../types";
import { getStatusColor, getStatusIcon } from "./FileTable";

interface FileDetailsModalProps {
	file: ScanFile;
	onClose: () => void;
}

export function FileDetailsModal({ file, onClose }: FileDetailsModalProps) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Modal Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">File Details</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				{/* Modal Content */}
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* File Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								File Information
							</h3>

							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Filename
									</label>
									<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
										{file.filename}
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Upload Time
									</label>
									<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
										{file.timestamp}
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										File ID
									</label>
									<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
										{file.id}
									</p>
								</div>
							</div>
						</div>

						{/* Scan Results */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Scan Results
							</h3>

							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Current Status
									</label>
									<div className="mt-1 flex items-center">
										{getStatusIcon(file.status)}
										<span
											className={`ml-2 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
												file.status
											)}`}
										>
											{file.status.charAt(0).toUpperCase() +
												file.status.slice(1)}
										</span>
									</div>
								</div>

								{file.result === "clean" && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<div className="flex items-center">
											<Shield className="h-5 w-5 text-green-500 mr-2" />
											<span className="text-sm font-medium text-green-800">
												No threats detected
											</span>
										</div>
										<p className="text-sm text-green-700 mt-1">
											This file has been scanned and is safe to use.
										</p>
									</div>
								)}

								{file.result === "infected" && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-4">
										<div className="flex items-center">
											<AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
											<span className="text-sm font-medium text-red-800">
												Threat detected
											</span>
										</div>
										<p className="text-sm text-red-700 mt-1">
											This file contains malicious content and should not be
											used.
										</p>
										<div className="mt-2">
											<p className="text-xs text-red-600">
												Threat Type: Trojan.Generic
											</p>
											<p className="text-xs text-red-600">Risk Level: High</p>
										</div>
									</div>
								)}

								{file.status === "scanning" && (
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
										<div className="flex items-center">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
											<span className="text-sm font-medium text-blue-800">
												Scan in progress
											</span>
										</div>
										<p className="text-sm text-blue-700 mt-1">
											Please wait while we analyze this file for threats.
										</p>
									</div>
								)}

								{file.status === "pending" && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<div className="flex items-center">
											<Clock className="h-5 w-5 text-yellow-500 mr-2" />
											<span className="text-sm font-medium text-yellow-800">
												Queued for scanning
											</span>
										</div>
										<p className="text-sm text-yellow-700 mt-1">
											This file is waiting to be scanned.
										</p>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Last Scan
									</label>
									<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
										{file.status === "pending"
											? "Not scanned yet"
											: file.timestamp}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
