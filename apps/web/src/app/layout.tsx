import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { ConfigProvider } from "@/context/ConfigContext"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "QA Boilerplate Generator",
  description:
    "Scaffold WebdriverIO, Playwright, or Cypress test projects from your browser.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  )
}
