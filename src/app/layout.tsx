import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from './components/Sidebar';
import NodeContextProvider from './components/NodeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Makro',
  description: 'Beutiful Software Architecture Designs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NodeContextProvider>
        <body className={`${inter.className} flex`}>
          <Sidebar />
          {children}
        </body>
      </NodeContextProvider>
    </html>
  );
}
