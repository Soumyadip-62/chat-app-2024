import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col h-full space-y-3">
      <h1 className="text-6xl font-bold">Welcome!</h1>
      <h2 className="text-3xl">Select a Chat To Open Messages</h2>
      <p className="text-xl text-gray-500">
        Made By{" "}
        <Link href="https://github.com/Soumyadip-62" className="hover:text-blue-600">Soumyadip Pandit</Link>
      </p>
    </div>
  );
}
