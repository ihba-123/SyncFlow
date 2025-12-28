import { useState, useEffect } from "react"
import { createPortal } from "react-dom" 
import { Search, X } from "lucide-react"

export default function SearchUI() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  // Prevent scrolling when search is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const searchModal = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4">
      
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 dark:bg-black/40 bg-[#66b3ff0d] backdrop-blur-[5px] saturate-150 animate-in fade-in duration-300"
      ></div>

      
      <div
        className="
          relative z-[100000] w-full max-w-2xl
          rounded-3xl
          bg-[#ffffff00]
          dark:bg-[#0a0a0a66] 
          backdrop-blur-[150px] saturate-[200%]
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]
          border border-white/20
          flex flex-col
          overflow-hidden
          animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out
        "
      >
        <div className="flex items-center gap-4 px-6 py-5 border-b dark:border-white/10 border-black/10">
          <Search size={22} className="dark:text-white/60 text-primary shrink-0" />
          <input
            autoFocus
            type="search"
            placeholder="What are you looking for?"
            className="w-full bg-transparent text-lg dark:text-white/90 text-black/80 placeholder:text-white/30 focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full dark:hover:bg-white/10 cursor-pointer  hover:bg-[#66b3ff67] transition-colors"
          >
            <X size={20} className="dark:text-white text-black/60" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="px-2 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-white px-3 mb-2">
              Recent Searches
            </p>
            <div className="space-y-1">
              {["Glassmorphism patterns", "Next.js 15 routing", "Tailwind v4 theme"].map((item) => (
                <div key={item} className="flex items-center gap-3 px-3  py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-primary dark:border-white/10">
                    <Search size={14} className="text-primary  dark:text-white/40" />
                  </div>
                  <span className="text-sm dark:text-white/70 dark:group-hover:text-white/90 group-hover:text-black/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Button */}
      <div className="hidden sm:block z-40 w-full max-w-md">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 w-full px-4 py-2 rounded-3xl backdrop-blur-md bg-[#66b3ff11] border border-gray-400 dark:border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          <Search size={16} className="text-primary" />
          <span className="text-sm text-gray-600 flex-1 text-left">Search...</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border border-gray-400 text-primary">ctrl+k</span>
        </button>
      </div>

      {/* Mobile Button */}
      <div className="sm:hidden z-40">
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-full bg-[#66b3ff2d] dark:bg-white/5 backdrop-blur-xl border border-white/20"
        >
          <Search size={18} className="text-[#66B2FF]" />
        </button>
      </div>

      {/* RENDER MODAL OUTSIDE THE NAVBAR FLOW */}
      {open && mounted && createPortal(searchModal, document.body)}
    </>
  )
}