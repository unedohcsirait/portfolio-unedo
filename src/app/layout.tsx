import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern 3D Portfolio",
  description: "A breathtaking interactive web portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
