import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e17",
};

export const metadata: Metadata = {
  title: "AI Carbon Footprint | Environmental Cost Visualizer",
  description:
    "Paste an AI conversation and see its hidden water, energy, and CO2 footprint in real time.",
  openGraph: {
    title: "AI Carbon Footprint Visualizer",
    description:
      "Visualizing the hidden environmental cost of AI conversations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
