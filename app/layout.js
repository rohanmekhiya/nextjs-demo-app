import './globals.css'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/sessionprovider'
import { getServerSession } from "next-auth";
import Header from './header/page';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NEXT-STOCK',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

