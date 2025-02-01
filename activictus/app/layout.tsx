import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Activictus",
  description: "Onze plek om aan te geven wanneer we waar zijn!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="gap-20 max-w-5xl p-5">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
