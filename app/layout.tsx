import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Flash App",
    description: "Generate flashcards using AI",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* AdSense Meta Tag for Verification */}
            <meta name="google-adsense-account" content="ca-pub-3130289951665725" />
            <title>Flash App</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AdSense Script (with Next.js optimization) */}
        <Script
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3130289951665725"
            crossOrigin="anonymous"
        />
        <Analytics />
        {children}
        </body>
        </html>
    );
}
