"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Google from "../../Assets/google.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full border p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 shadow-md"
      >
        <Image
          src={Google}
          alt="Google Logo"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Sign in with Google
      </button>

      <div className="my-4 text-center">
       
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
