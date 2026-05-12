import React from "react";

/**
 * Cinematic gradient stack — midnight navy, soft depth, champagne haze.
 * No harsh blacks; reads as luxury film grade, not UI chrome.
 */
export default function HeroOverlay({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1528]/95 via-[#141e30]/88 to-[#1c1824]/82" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070d18]/92 via-[#0a1525]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1528]/95 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_85%_15%,rgba(247,231,206,0.11),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_85%,rgba(100,120,150,0.12),transparent_45%)]" />
    </div>
  );
}
