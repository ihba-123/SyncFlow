import { useState } from "react";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full shadow-md fixed top-0 left-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">SyncFlow</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">Pricing</a>
        </div>

        {/* Buttons (Desktop) */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Login</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          {open ? (
            <X size={28} onClick={() => setOpen(false)} />
          ) : (
            <Menu size={28} onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-4 shadow-sm">
          <a href="#" className="block hover:text-blue-600">Home</a>
          <a href="#" className="block hover:text-blue-600">Features</a>
          <a href="#" className="block hover:text-blue-600">Pricing</a>

          <button className="w-full py-2 border rounded-lg">Login</button>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
