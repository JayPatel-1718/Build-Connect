import React from "react";
import { Search, Bell, MessageSquare, Filter } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <img
            src="/logo192.png"
            alt="BuildConnect"
            className="w-8 h-8 rounded"
          />
          <div>
            <h1 className="font-semibold text-lg">BuildConnect</h1>
            <p className="text-xs text-gray-500">by PixelFusion</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
            <img
              src="https://via.placeholder.com/30"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-sm">Shanaya Mehta</span>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center bg-white rounded-lg shadow p-2 w-full max-w-md">
          <Search className="w-5 h-5 text-gray-500 mx-2" />
          <input
            type="text"
            placeholder="Type something here..."
            className="w-full outline-none bg-transparent"
          />
        </div>
        <button className="flex items-center bg-white shadow rounded-lg px-3 py-2 ml-3 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Content Section */}
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left card */}
        <div className="bg-white shadow rounded-2xl p-5 flex flex-col items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">The Community</h2>
            <p className="text-gray-600 mb-3">Join our growing network</p>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
              Explore Now
            </button>
          </div>
          <div className="flex mt-4 -space-x-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/women/45.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/men/76.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </div>
        </div>

        {/* Right card (news style) */}
        <div className="bg-white shadow rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/60"
              alt="logo"
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="font-medium">World of Concrete India 2025</h3>
              <p className="text-gray-500 text-sm">
                Scheduled from October 16–18, 2025 at the Bombay Exhibition
                Centre, Mumbai. The event will showcase construction innovations
                and technologies.
              </p>
              <p className="text-xs text-gray-400 mt-1">55s ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/60"
              alt="logo"
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="font-medium">
                PitchDeck AI launches freemium builder
              </h3>
              <p className="text-gray-500 text-sm">
                AI-powered platform now offers a free plan for startups to build
                stunning presentations.
              </p>
              <p className="text-xs text-gray-400 mt-1">1d ago</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}