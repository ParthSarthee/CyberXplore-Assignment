interface PaginationProps {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	totalItems: number;
	startIndex: number;
	endIndex: number;
	setItemsPerPage: (value: number) => void;
	setCurrentPage: (value: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	itemsPerPage,
	totalItems,
	startIndex,
	endIndex,
	setItemsPerPage,
	setCurrentPage,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const startPage = Math.max(1, currentPage - 2);
			const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

			if (startPage > 1) {
				pages.push(1);
				if (startPage > 2) pages.push("...");
			}

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const goToPreviousPage = () => {
		setCurrentPage(Math.max(1, currentPage - 1));
	};

	const goToNextPage = () => {
		setCurrentPage(Math.min(totalPages, currentPage + 1));
	};

	return (
		<div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
			<div className="flex items-center justify-between">
				{/* Results info */}
				<div className="flex items-center">
					<p className="text-sm text-gray-700">
						Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
						<span className="font-medium">
							{Math.min(endIndex, totalItems)}
						</span>{" "}
						of <span className="font-medium">{totalItems}</span> results
					</p>

					{/* Items per page selector */}
					<div className="ml-6 flex items-center">
						<label
							htmlFor="itemsPerPage"
							className="text-sm text-gray-700 mr-2"
						>
							Show:
						</label>
						<select
							id="itemsPerPage"
							value={itemsPerPage}
							onChange={(e) => {
								setItemsPerPage(Number(e.target.value));
								setCurrentPage(1);
							}}
							className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
						</select>
						<span className="text-sm text-gray-700 ml-1">per page</span>
					</div>
				</div>

				{/* Pagination controls */}
				<div className="flex items-center space-x-2">
					{/* Previous button */}
					<button
						onClick={goToPreviousPage}
						disabled={currentPage === 1}
						className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="sr-only">Previous</span>
						<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{/* Page numbers */}
					<div className="flex space-x-1">
						{getPageNumbers().map((page, index) => (
							<button
								key={index}
								onClick={() =>
									typeof page === "number" ? goToPage(page) : undefined
								}
								disabled={page === "..."}
								className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
									page === currentPage
										? "bg-blue-600 text-white border-blue-600"
										: page === "..."
										? "bg-white text-gray-400 border-gray-300 cursor-default"
										: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
							>
								{page}
							</button>
						))}
					</div>

					{/* Next button */}
					<button
						onClick={goToNextPage}
						disabled={currentPage === totalPages}
						className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="sr-only">Next</span>
						<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
