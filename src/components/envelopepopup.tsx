import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}
const supabase = createClient(supabaseUrl, supabaseKey);

interface EnvelopePopupProps {
  onClose: () => void;
  userEmail: string;
  onEnvelopeCreated: () => void;
}

export default function EnvelopePopup({ onClose, userEmail, onEnvelopeCreated }: EnvelopePopupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#F87171"); // Default red color
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { name: "Red", value: "#F87171" },
    { name: "Blue", value: "#60A5FA" },
    { name: "Green", value: "#34D399" },
    { name: "Purple", value: "#A78BFA" },
    { name: "Yellow", value: "#FBBF24" },
    { name: "Pink", value: "#F472B6" },
    { name: "Black", value: "#000000" },
  ];

  interface NewEnvelope {
    gmail: string;
    "envelope-name": string;
    "envelope-color": string;
    "envelope-description": string;
    "envelope-numchannel": number;
    channels: any[];
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter an envelope name");
      return;
    }
    
    setIsLoading(true);
  
    // Prepare the data object according to your Supabase table schema
    const newEnvelope: NewEnvelope = {
      gmail: userEmail,
      "envelope-name": name,
      "envelope-color": color,
      "envelope-description": description,
      "envelope-numchannel": 0,
      channels: []
    };
  
    console.log("Adding envelope to Supabase:", newEnvelope);
  
    try {
      // Insert the new envelope into the Supabase table
      const { data, error } = await supabase
        .from("userdata")
        .insert([newEnvelope])
        .select(); // Use .select() to return the inserted data
  
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Envelope created successfully:", data);
      onEnvelopeCreated(); // Trigger refetch of envelopes
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error creating envelope:", error);
      alert("Failed to create envelope. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <section className="absolute inset-0 bg-black w-full h-full z-20 opacity-60"></section>
    <div className="fixed inset-0 flex items-center justify-center z-50 shadow-2xl">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Envelope</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Envelope Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter envelope name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter envelope description"
              rows={3}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Envelope Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <div 
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full cursor-pointer ${color === option.value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Envelope"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </section>
  );
}