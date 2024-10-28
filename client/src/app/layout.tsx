import NavWrapper from '@/components/NavWrapper' // Import the new NavWrapper component
import { ThemeProvider } from '@/components/theme-provider'
import StoreProvider from '@/store/StoreProvider'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Ducky',
  description: 'Album collaboration platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <div className='flex flex-col items-center w-full'>
              <NavWrapper />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </StoreProvider>
    </html>
  )
}
