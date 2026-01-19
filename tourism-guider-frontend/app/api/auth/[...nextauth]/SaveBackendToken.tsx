"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SaveBackendToken() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken) {
      sessionStorage.setItem("backendToken", session.backendToken);
    }
  }, [session]);

  return null;
}
