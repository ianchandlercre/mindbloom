import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindBloom - Brain Training',
  description: 'Personalized brain training that adapts to you. Keep your mind sharp with fun, engaging games.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
