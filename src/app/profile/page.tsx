"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Settings, Rss } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EnvelopePopup from "@/components/envelopepopup"; // Adjust this path as needed
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  interface Envelope {
    id: string;
    "envelope-color": string;
    "envelope-name": string;
    "envelope-numchannel": number;
    "envelope-description"?: string;
  }

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchEnvelopes();
    }
  }, [session]);

  const fetchEnvelopes = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      console.log("Fetching envelopes for:", session.user.email);
      
      const { data, error } = await supabase
        .from("userdata")
        .select("*")
        .eq("gmail", session.user.email);

      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }

      console.log("Fetched envelopes:", data);
      setEnvelopes(data || []);
    } catch (error) {
      console.error("Error fetching envelopes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnvelopeCreated = () => {
    console.log("Envelope created, refreshing list...");
    fetchEnvelopes();
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2">
              <button className="bg-white p-2 gap-2 flex border-none rounded-[6px] text-black hover:bg-[#f8f8f8]">
                <Settings className="size-[20px]" />
                <h1 className="font-semibold text-[15px]">Settings</h1>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col bg-white border-none">
              <DropdownMenuItem>
                <Link href="/settings">
                  <button className="flex w-full">Settings</button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="flex text-red-600 w-full h-full"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="absolute bg-black h-12 w-full"></div>
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
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

        <div className="flex gap-[42px] flex-wrap items-center">
          {/* + Create Button */}
          <button
            className="w-32 h-40 border border-gray-300 rounded-xl flex flex-col items-center justify-center hover:shadow-md transition my-12"
            onClick={() => setShowPopup(true)}
          >
            +
            <span className="text-sm">Create</span>
          </button>

          {loading ? (
            <div className="flex items-center justify-center w-full py-4">
              <div className="w-6 h-6 border-t-2 border-b-2 border-amber-600 rounded-full animate-spin"></div>
              <span className="ml-2">Loading envelopes...</span>
            </div>
          ) : envelopes.length === 0 ? (
            <div className="text-gray-500 py-4">
              No envelopes found. Create your first envelope!
            </div>
          ) : (
            envelopes.map((envelope, index) => (
              <div
                key={envelope.id || index}
                className="w-52 h-64 rounded-xl overflow-hidden border border-[#f1f1f1] shadow-sm hover:shadow-md transition flex flex-col cursor-pointer"
                onClick={() => {
                  router.push(`/zachaneru?id=${envelope["envelope-name"]}`);
                }}
              >
                <div
                  className="flex-1"
                  style={{ backgroundColor: envelope["envelope-color"] }}
                />
                <div className="px-2 py-[10px] text-[12px]">
                  <div className="flex justify-between text-[15px] font-semibold items-center">{envelope["envelope-name"]}<div className="flex items-center text-gray-700 py-1">
                      <Rss className="w-[10px] h-[20px] mx-1" />
                      <span>{envelope["envelope-numchannel"] || 0}</span>
                    </div></div>
                  <div className="text-gray-500">@{session.user?.email?.split("@")[0]}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Envelope Creation Popup */}
      {showPopup && (
        <EnvelopePopup
          onClose={() => setShowPopup(false)}
          userEmail={session?.user?.email ?? ""}
          onEnvelopeCreated={handleEnvelopeCreated}
        />
      )}
    </div>
  );
}