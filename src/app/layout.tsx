import './globals.css'
import AppLayout from './AppLayout';

export const metadata = {
  title: 'My Next JS',
  description: 'Login Page',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
