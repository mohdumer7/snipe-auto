'use client';

import './globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { WalletContextProvider } from '@/context/WalletProvider';
import NotificationsPanel from '@/components/NotificationsPanel';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
          <NotificationsPanel />
        </WalletContextProvider>
      </body>
    </html>
  );
}
