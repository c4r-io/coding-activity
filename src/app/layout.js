import './css/globals.css';
// import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react'; 
import { SpeedInsights } from '@vercel/speed-insights/next'; 
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { AllContextProviders } from '@/contextapi/AllContextProviders';
// const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'Coding Activity',
  description: 'Coding Activity description',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body className={``}>
        <AllContextProviders>
          {children}
          <ToastContainer />
        </AllContextProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
