import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

const InvitePageDetail = ({ showModal, setShowModal , selectedRole ,handleCopy , copied , Copy , Check}) => {
  return (
    <div>
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-10/10 dark:bg-black/10 backdrop-blur-2xl"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold dark:text-white text-slate-900">Invite Ready</h3>
                  <p className="text-xs text-slate-500">Security token generated for <span className="text-blue-500 font-bold">{selectedRole}</span> access.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden group transition-all focus-within:ring-2 ring-blue-500/20">
                    <input readOnly value="saas.io/join/invite-xyz" className="flex-1 bg-transparent py-4 px-5 text-sm font-bold dark:text-slate-200 focus:outline-none" />
                    <button onClick={handleCopy} className="px-5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all border-l border-slate-200 dark:border-white/5">
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1 tracking-widest">ID Code</span>
                      <span className="text-xs font-mono font-bold dark:text-slate-300">#9981</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1 tracking-widest">Expires</span>
                      <span className="text-xs font-bold dark:text-slate-300">3 Days</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-bold rounded-2xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InvitePageDetail
