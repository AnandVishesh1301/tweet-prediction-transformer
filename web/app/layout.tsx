/* web/app/layout.tsx */
import './globals.css';     // Tailwind base / custom globals

export const metadata = {
  title: 'Trump Tweet Generator',
  description: 'Playful AI tweet generator with adjustable parameters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#101942] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
