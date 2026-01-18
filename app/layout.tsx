import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: "BookingCilex - Event Booking",
  description: "Book events in Ibiza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
