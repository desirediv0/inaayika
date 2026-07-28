"use client";

import { Video } from "lucide-react";

export const FloatingBookCall = () => {
  return (
    <a
      href="https://dayschedule.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[140px] md:bottom-24 right-4 md:right-6 z-50 group cursor-pointer"
      aria-label="Book Video Call"
    >
      {/* Circle - Default (hidden on hover) */}
      <div className="flex items-center justify-center w-14 h-14 bg-[#003E29] border border-[#B08D57]/50 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-2xl group-hover:border-[#B08D57] transition-all duration-300">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#B08D57] bg-[#B08D57]/10">
          <Video className="w-5 h-5 text-[#B08D57]" />
        </div>
      </div>

      {/* Expanded pill - visible on hover */}
      <div className="absolute right-0 top-0 flex items-center gap-2.5 h-14 bg-[#003E29] border border-[#B08D57] rounded-full shadow-2xl pl-1 pr-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#B08D57] bg-[#B08D57]/10 shrink-0">
          <Video className="w-5 h-5 text-[#B08D57]" />
        </div>
        <div className="flex flex-col leading-tight whitespace-nowrap">
          <span className="text-[#B08D57] text-[9px] font-bold tracking-widest uppercase">
            ✦ Live Available
          </span>
          <span className="text-[#FDFBF7] text-sm font-bold">
            Book Video Call
          </span>
        </div>
      </div>
    </a>
  );
};

export default FloatingBookCall;
