import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
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
				className={`${inter.variable} font-sans font-medium antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
