"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Google from "../../Assets/google.png";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess("");
    setForgotError("");

    try {
      const res = await axios.post(`http://localhost:8081/api/v1/auth/forgetPassword?email=${forgotEmail}`);
      if (res.status !== 200) {
        throw new Error("Failed to send reset link");
      }

      setForgotSuccess("Password reset link sent to your email.");
      setForgotEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setForgotError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to send reset link. Try again.",
      );
    }
  };

  return (
    <>
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

        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
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
          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Forgot your password?{" "}
          <button
            onClick={() => setShowForgotModal(true)}
            className="text-blue-600 hover:underline"
          >
            Reset here
          </button>
        </p>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotError("");
                setForgotSuccess("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-3">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email to receive a password reset link.
            </p>

            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="border p-2 rounded"
                required
              />

              {forgotSuccess && (
                <p className="text-sm text-green-600">{forgotSuccess}</p>
              )}
              {forgotError && (
                <p className="text-sm text-red-600">{forgotError}</p>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  Send Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 border p-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
