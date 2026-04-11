import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Abort",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          {/* 🌌 Backdrop with deep blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* 🛰️ Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1220]/80 p-8 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {/* Warning Glow Decoration */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10">
              {/* Icon Section */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-black tracking-tight text-white">
                {title}
              </h3>
              
              <p className="mt-4 text-sm leading-7 text-white/50">
                {description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="group relative w-full overflow-hidden rounded-xl bg-red-500 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
                >
                  <span className="relative z-10">{confirmLabel}</span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;