import type { Metadata } from "next";
import { ThemeProvider } from "@/components/Provider/Theme/theme-provider";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import ReduxProvider from "@/components/ReduxProvider/Redux";
import { NextUIProvider } from "@nextui-org/system";
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
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <NextUIProvider>{children}</NextUIProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
