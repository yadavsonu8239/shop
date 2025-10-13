import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shop Finance Management',
  description: 'Manage your shop finances efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} text-gray-900 bg-gray-50`} suppressHydrationWarning>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto text-gray-900 w-full lg:w-auto pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
