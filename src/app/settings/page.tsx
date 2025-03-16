"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [discoverable, setDiscoverable] = useState(true);
  const [username, setUsername] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    // Add API call here to update user info
    console.log("Saved Settings:", { username, password, discoverable });
    alert("Settings saved (fake for now, cuh)");
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Basic Info */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Profile Discoverable</span>
          <button
            onClick={() => setDiscoverable((prev) => !prev)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              discoverable
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {discoverable ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition font-semibold text-sm"
      >
        Save Changes
      </button>

      {/* Logout */}
      <div className="my-10 border-t pt-6">
        <button
          onClick={handleLogout}
          className="w-full border border-red-500 text-red-600 py-2 rounded-md hover:bg-red-50 transition text-sm font-semibold"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
