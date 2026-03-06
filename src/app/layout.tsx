import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
	title: {
		default: "Anna's Art Adventure",
		template: "%s | Anna's Art Adventure",
	},
	description:
		"A creative journey through art from age 2 to today. Drawings, paintings, animations, and more.",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
	),
	openGraph: {
		title: "Anna's Art Adventure",
		description: "A creative journey through art from age 2 to today.",
		type: "website",
	},
	other: {
		copyright: "Anna's Art Adventure",
		rights:
			"All artwork is copyrighted. No reproduction without permission.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
			>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: SITE_CONFIG.name,
							url: SITE_CONFIG.url,
							description: SITE_CONFIG.description,
						}),
					}}
				/>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
				>
					Skip to content
				</a>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
