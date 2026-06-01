import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionalLayout from "@/components/ConditionalLayout";
import Preloader from "@/components/Preloader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-body' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-heading' });

export const metadata: Metadata = {
  title: "AIRSYSTEMS1 SHOP - Premium Employee Portal",
  description: "Exclusive Airsystems1 store for employees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <Preloader />
        <StoreProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </StoreProvider>
        
        {/* Google Translate Integration */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  );
}
