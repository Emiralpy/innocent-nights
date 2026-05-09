import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "the night archive | innocent nights™",
  description: "a private midnight archive for innocent nights™."
};

export default function NightArchiveLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
