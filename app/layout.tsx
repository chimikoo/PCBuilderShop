import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PCBuilderShop - Premium Computer Parts",
  description:
    "Your trusted partner for premium computer parts and components. Build your dream PC with the best hardware at unbeatable prices.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
