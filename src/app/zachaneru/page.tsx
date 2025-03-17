"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Rss, X as XIcon, Settings } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EnvelopeDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const envelopeName = searchParams.get("id");

  const [showAddChannelPopup, setShowAddChannelPopup] = useState(false);
  const [channelType, setChannelType] = useState("x");
  const [channelDescription, setChannelDescription] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface Envelope {
    "envelope-color": string;
    "envelope-name": string;
    "envelope-numchannel": number;
    "envelope-description"?: string;
    channels?: Channel[];
  }

  interface Channel {
    id?: string;
    channel_type: string;
    channel_url: string;
    channel_description: string;
    created_at?: string;
  }

  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email && envelopeName) {
      fetchEnvelopeDetails();
    }
  }, [session, envelopeName]);

  const fetchEnvelopeDetails = async () => {
    if (!session?.user?.email || !envelopeName) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("userdata")
        .select("*")
        .eq("envelope-name", envelopeName)
        .eq("gmail", session.user.email)
        .single();

      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }

      // Ensure channels is an array (handle null or undefined)
      if (!data.channels) {
        data.channels = [];
      }

      setEnvelope(data || null);
    } catch (error) {
      console.error("Error fetching envelope details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!envelope || !channelType || !channelUrl || !channelDescription) return;

    setIsSubmitting(true);
    try {
      // Create new channel object
      const newChannel = {
        id: crypto.randomUUID(),
        channel_type: channelType,
        channel_url: channelUrl,
        channel_description: channelDescription,
        created_at: new Date().toISOString(),
      };

      // Get existing channels or initialize empty array
      const existingChannels = envelope.channels || [];

      // Add new channel to the array
      const updatedChannels = [newChannel, ...existingChannels];

      // Update the envelope with new channel and increment count
      const { error } = await supabase
        .from("userdata")
        .update({
          channels: updatedChannels,
          "envelope-numchannel": (envelope["envelope-numchannel"] || 0) + 1,
        })
        .eq("envelope-name", envelope["envelope-name"]) // Use envelope-name
        .eq("gmail", session?.user?.email); // Use gmail

      if (error) throw error;

      // Refresh the envelope details
      fetchEnvelopeDetails();

      // Close popup and reset form
      setShowAddChannelPopup(false);
      setChannelType("x");
      setChannelUrl("");
      setChannelDescription("");
    } catch (error) {
      console.error("Error adding channel:", error);
      alert("Failed to add channel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || !session) return null;

  const getChannelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "x":
        return (
          <div className="bg-black text-white rounded-lg p-2">
            <XIcon className="w-6 h-6" />
          </div>
        );
      case "medium":
        return (
          <div className="bg-black text-white rounded-lg p-2">
            <Rss className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-800 text-white rounded-lg p-2">
            <Rss className="w-6 h-6" />
          </div>
        );
    }
  };

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

      {/* Back button and envelope header */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        {envelope ? (
          <><div className="flex justify-between">
            <div className="flex items-center my-4">
              <div
                className="w-12 h-12 rounded-lg mr-4"
                style={{ backgroundColor: envelope["envelope-color"] }}
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {envelope["envelope-name"]}
                </h1>
                <div className="text-sm text-gray-500">
                  @{session.user?.email?.split("@")[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-6">
              <Link
                href="/profile"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Profile</span>
              </Link>
            </div></div>

            {envelope["envelope-description"] && (
              <p className="text-gray-700 mb-6">
                {envelope["envelope-description"]}
              </p>
            )}
          </>
        ) : loading ? (
          <div className="flex items-center">
            <div className="w-6 h-6 border-t-2 border-b-2 border-amber-600 rounded-full animate-spin"></div>
            <span className="ml-2">Loading envelope details...</span>
          </div>
        ) : (
          <div className="text-gray-500">Envelope not found</div>
        )}
      </div>

      {/* Channels Section */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold flex items-center">
            <Rss className="w-5 h-5 mr-2" />
            Channels
          </h2>
          <button
            className="bg-black text-white rounded-full p-2"
            onClick={() => setShowAddChannelPopup(true)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <hr className="mb-4 border-gray-300" />

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center w-full py-4">
              <div className="w-6 h-6 border-t-2 border-b-2 border-amber-600 rounded-full animate-spin"></div>
              <span className="ml-2">Loading channels...</span>
            </div>
          ) : !envelope?.channels || envelope.channels.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">
              No channels added yet. Add your first channel with the + button
              above.
            </div>
          ) : (
            envelope.channels.map((channel, index) => (
              <div
                key={channel.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-start"
              >
                {getChannelIcon(channel.channel_type)}
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {channel.channel_type.charAt(0).toUpperCase() +
                        channel.channel_type.slice(1)}
                    </h3>
                    {channel.created_at && (
                      <span className="text-gray-500 text-sm">
                        {new Date(channel.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {channel.channel_url}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Channel Popup */}
      {showAddChannelPopup && (
        <section>
          <section className="absolute inset-0 w-full h-full bg-black opacity-40 z-20">
            a
          </section>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setShowAddChannelPopup(false)}
              >
                <XIcon className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4">Add New Channel</h2>

              <form onSubmit={handleAddChannel}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value)}
                    required
                  >
                    <option value="x">X Account</option>
                    <option value="website">News Website</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={
                      channelType === "x"
                        ? "https://x.com/user"
                        : "https://example.com"
                    }
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What should the AI extract?
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
                    placeholder="Describe what information the AI should extract from this source..."
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setShowAddChannelPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Channel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
