"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: "/" 
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      Sign out
    </button>
  );
}