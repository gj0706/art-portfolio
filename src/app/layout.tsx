import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Anna's Art Portfolio",
		template: "%s | Anna's Art Portfolio",
	},
	description:
		"A creative journey through art from age 2 to today. Drawings, paintings, animations, and more.",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
	),
	openGraph: {
		title: "Anna's Art Portfolio",
		description: "A creative journey through art from age 2 to today.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
