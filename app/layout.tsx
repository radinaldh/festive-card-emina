import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";

// Assuming you want to keep the font logic here, but ideally it should be in _app.tsx or a CSS file.
const poppins = Poppins({ style: "normal", weight: "400", subsets: ["latin"] });

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return <main className={poppins.className}>{children}</main>;
}
