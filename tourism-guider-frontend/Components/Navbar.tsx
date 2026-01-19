import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">Tourism Guider</h1>
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
