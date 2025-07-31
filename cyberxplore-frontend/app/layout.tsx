import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Virus Scanner Dashboard",
	description: "File upload and virus scanning dashboard",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 5000,
						style: {
							background: "#fff",
							color: "#333",
							borderRadius: "8px",
							boxShadow:
								"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
						},
						success: {
							iconTheme: {
								primary: "#10b981",
								secondary: "#fff",
							},
						},
						error: {
							iconTheme: {
								primary: "#ef4444",
								secondary: "#fff",
							},
						},
					}}
				/>
			</body>
		</html>
	);
}
