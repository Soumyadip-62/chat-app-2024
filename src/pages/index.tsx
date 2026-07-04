
import { Inter } from "next/font/google";
import Link from "next/link";
import Layout from "@/Layout/Index";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center flex-col h-full text-center p-6 space-y-6">
        <div className="size-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-violet-950/30 border border-violet-400/20 animate-pulse">
          💬
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-100 tracking-tight sm:text-3xl">
            Welcome to ChatBox
          </h1>
          <p className="text-gray-400 max-w-sm text-base">
            Select a chat from the sidebar or search for users to start a conversation.
          </p>
        </div>
        <div className="text-sm text-gray-500 pt-8 border-t border-white/5 w-44">
          <p>
            Made By{" "}
            <Link
              href="https://github.com/Soumyadip-62"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-200"
              target="_blank"
              rel="noreferrer"
            >
              Soumyadip Pandit
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
