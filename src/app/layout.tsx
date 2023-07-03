import "./globals.css";

import { Inter } from "next/font/google";
import MuiProvider from "@/providers/mui-provider";
import NextAuthProvider from "@/components/Provider";
import ReactQueryWrapper from "@/lib/react-query-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Calendar Table",
	description: "Calendar Table app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<title>Google Calendar Table</title>
			<body className={inter.className}>
				<NextAuthProvider>
					
					<ReactQueryWrapper>
					<MuiProvider>{children}</MuiProvider>
					</ReactQueryWrapper>
					
				</NextAuthProvider>
			</body>
		</html>
	);
}
