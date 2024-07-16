import type { Metadata } from "next";
import { ThemeProvider } from "@/components/Provider/Theme/theme-provider";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Maker by LokerAI",
  description: "Generated your CV for Free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
