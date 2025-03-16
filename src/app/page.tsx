"use client";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { SquareArrowUpRight, Github, LucideLinkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { status } = useSession(); // status can be: 'loading' | 'authenticated' | 'unauthenticated'
  const router = useRouter();
  // Redirect when session is ready and authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  // 🔥 Handle loading state early (prevent flash)
  if (status === "loading" || status === "authenticated") {
    return null; // Don't render landing while checking or redirecting
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Enhanced Glassmorphism Navbar */}
      <nav className="backdrop-blur-lg bg-white/30 border-b border-white/20 sticky top-0 z-50 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="Athnen Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold tracking-tight">Athnen</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium relative hover:text-black transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-black after:transition-all hover:after:w-full"
            >
              Features
            </a>
            <button
              onClick={() => signIn("google", { callbackUrl: "/profile" })}
              className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="text-sm font-medium">Login with Google</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Swiss Design Principles */}
      <section className="flex flex-col items-center justify-center px-8 py-32 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-center leading-none mb-8">
          Intelligence,
          <br />
          Curated.
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl text-center mb-12">
          Athnen is your AI-powered research companion for fast-moving markets.
          Stay ahead of the curve with agent-curated insights, organized into
          Envelopes filled with trusted sources.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="flex items-center space-x-3 px-6 py-4 text-white bg-black rounded-md border border-gray-200 shadow-md hover:text-black hover:bg-white transition-all"
        >
          <span className="font-medium">Get started</span>{" "}
          <SquareArrowUpRight />
        </button>
      </section>

      {/* Feature Grid with Swiss Design */}
      <section
        id="features"
        className="px-8 py-24 bg-white/50 backdrop-blur-md pb-52"
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-16 text-center">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Envelopes",
                desc: "Create topic-specific folders (e.g. AI in Finance, Ethereum Ecosystem).",
              },
              {
                title: "Channels",
                desc: "Add X accounts, websites, or blogs to feed each Envelope.",
              },
              {
                title: "AI Summaries",
                desc: "Let Athnen's agent distill daily insights from your sources.",
              },
              {
                title: "Social Discovery",
                desc: "Explore or follow Envelopes curated by top investors & analysts.",
              },
              {
                title: "Monetization",
                desc: "Turn high-quality curation into tradable intelligence assets.",
              },
              {
                title: "Fast Research",
                desc: "Track what matters faster — without drowning in noise.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="border-t border-gray-200 py-6">
                <h4 className="text-lg font-semibold mb-3">{feature.title}</h4>
                <p className="text-sm text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Social Links */}
      <footer className="bg-[#f8f8f8] backdrop-blur-md border-t border-gray-100">
        <div className="max-w-6xl mx-auto py-7 px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Logo and Tagline */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt="Athnen Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold">Athnen</span>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Intelligence, curated. Stay ahead of fast-moving markets with
                AI-powered research.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href="#features"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Connect Section */}
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Prabhmeetchef/Athnen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/40 backdrop-blur-sm hover:bg-black hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/company/athnen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/40 backdrop-blur-sm hover:bg-black hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LucideLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-2 text-center text-sm text-gray-600">
            <p>© 2025 Athnen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
