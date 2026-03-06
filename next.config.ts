import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "media.annasartadventure.com" },
			{ protocol: "https", hostname: "**.r2.dev" }, // keep during migration
			{ protocol: "https", hostname: "img.youtube.com" },
		],
		deviceSizes: [640, 750, 828, 1080, 1200], // cap at 1200px
	},

	async headers() {
		return [
			{
				source: "/_next/image",
				headers: [
					{ key: "X-Robots-Tag", value: "noindex, nofollow" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{
						key: "Content-Security-Policy",
						value: "frame-ancestors 'self'",
					},
				],
			},
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;
