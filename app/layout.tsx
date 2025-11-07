import "./globals.css";   // ✅ Add this

export const metadata = {
  title: "Art Quiz Game",
  description: "Guess painters or painting titles from The MET Collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
