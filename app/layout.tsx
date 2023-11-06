import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'
import { CrispProvider } from '@/components/crisp-provider'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import './globals.css'
import { LoginModalProvider } from '@/components/login-modal-provider'

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Imaginify',
  description: 'AI Image Platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider  afterSignInUrl='/dashboard' afterSignUpUrl='/dashboard'>
      <html lang="en" suppressHydrationWarning={true}>
        <CrispProvider />
        <body className={font.className}>
          <ToasterProvider />
          <ModalProvider />
         <LoginModalProvider/>      
             {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
