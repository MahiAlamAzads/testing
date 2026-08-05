import './globals.css';
import NetworkHelper from '@/components/NetworkHelper';
export const metadata = {
    title: 'Supply Chain Manager',
    description: 'Blockchain-based Supply Chain Management System',
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body>
        <NetworkHelper />
        {children}
      </body>
    </html>);
}
