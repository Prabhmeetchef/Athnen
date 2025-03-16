"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings, Rss } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Athnen Logo" width={32} height={32} />
          <h1 className="text-xl font-bold">Athnen</h1>
        </div>
        <div className="relative flex object-center justify-center gap-[20px]">

          <DropdownMenu >
            <DropdownMenuTrigger className="flex gap-2">
              <button className="bg-white p-2 gap-2 flex border-none rounded-[6px] text-black hover:bg-[#f8f8f8]"><Settings className="size-[20px]"/><h1 className="font-semibold text-[15px]">Settings</h1></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col bg-white border-none ">
              <DropdownMenuItem><Link href="/settings"><button className="flex w-full">Settings</button></Link></DropdownMenuItem>
              <DropdownMenuItem><button className="flex text-red-600 w-full h-full" onClick={() => signOut()}>Logout</button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="absolute bg-black h-12 w-full"></div>
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 ">
        <div className="w-24 h-24 rounded-full bg-gradient-to-t from-amber-950 to-amber-600 flex items-center justify-center text-white text-4xl font-bold z-10 border-white border-[2.7px]">
          {session.user?.name?.charAt(0) ?? "U"}
        </div>
        <div className="text-lg font-semibold py-2 pb-0">
          {session.user?.name}
        </div>
        <div className="text-sm text-gray-500">
          @{session.user?.email?.split("@")[0]}
        </div>
      </div>

      {/* My Envelopes Section */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-xl font-semibold mb-2">My Envelopes</h2>
        <hr className="mb-4 border-gray-300" />

        <div className="flex gap-4 flex-wrap items-center">
          {/* + Create Button */}
          <button className="w-32 h-40 border border-gray-300 rounded-xl flex flex-col items-center justify-center hover:shadow-md transition">
            +
            <span className="text-sm">Create</span>
          </button>

          {/* Example Envelope Card */}
          <div className="w-52 h-64 rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-red-700 to-black" />
            <div className="px-2 py-2 text-xs">
              <div className="font-medium">AMD Reports</div>
              <div className="text-gray-500">@prabhmeetsingh1469</div>
              <div className="flex items-center text-gray-700 py-1">
                <Rss className="w-3 h-3 mr-1" />
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="w-52 h-64 rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex-1 bg-black" />
            <div className="px-2 py-2 text-xs">
              <div className="font-medium">OpenAI News</div>
              <div className="text-gray-500">@prabhmeetsingh1469</div>
              <div className="flex items-center text-gray-700 py-1">
                <Rss className="w-3 h-3 mr-1" />
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
