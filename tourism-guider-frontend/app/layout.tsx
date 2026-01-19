import Navbar from "../Components/Navbar";
import "../Styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
