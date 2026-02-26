import { Cormorant_Garamond } from "next/font/google";

import PageTransitionOverlay from "@/components/PageTransitionOverlay.client";

import "./globals.scss";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant-garamond",
});

export const metadata = {
  title: "Masha Kolosovskaya",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={cormorantGaramond.variable}>
        {children}
        <PageTransitionOverlay />
      </body>
    </html>
  );
}
