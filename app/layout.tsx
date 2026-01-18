import './styles/globals.css';

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
        {children}
      </body>
    </html>
  );
}
