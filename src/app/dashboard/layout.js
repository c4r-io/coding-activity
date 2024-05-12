// import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
// const inter = Inter({ subsets: ['latin'] });
import Sidebar from '@/components/Sidebar.jsx';
export const metadata = {
  title: 'Coding Activity',
  description: 'Coding Activity app description',
};
export default function RootLayout({ children }) {
  return (
    <div className="bg-gray-700">
      {children}
    </div>
  );
}
