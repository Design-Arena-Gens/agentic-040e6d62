import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Soccer Betting Prompt Builder',
  description: 'Generate powerful prompts for soccer betting analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
