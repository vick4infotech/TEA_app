import './globals.css';
import { APP_NAME, CHURCH_NAME } from '@/lib/constants';

export const metadata = {
  title: `${APP_NAME} | ${CHURCH_NAME}`,
  description: `${APP_NAME} for ${CHURCH_NAME}`,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/tea-logo-compact.png'
  }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
