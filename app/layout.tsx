import './styles/globals.css';
import ClientLayout from './components/ClientLayout';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
