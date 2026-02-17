import React from "react";

/**
 * Portable SVG lockup (no plugins required).
 * Note: Script font will vary by OS unless you ship a webfont.
 * Later: replace <text> with Figma SVG paths for perfect fidelity.
 */
export default function VmbLogo({
  variant = "blackGold", // "black" | "gold" | "blackGold"
  size = "md", // "sm" | "md" | "lg"
  className = "",
  title = "VMB — Ven Me Baby",
}) {
  const sizes = {
    sm: { w: 170, h: 52 },
    md: { w: 220, h: 64 },
    lg: { w: 270, h: 76 },
  };

  const { w, h } = sizes[size] ?? sizes.md;
  const lockupCenterX = 145;

  const palette =
    {
      black: { mark: "#1F1B1A", script: "#3A3432", accent: "#1F1B1A" },
      gold: { mark: "#B08D57", script: "#6B6460", accent: "#B08D57" },
      blackGold: { mark: "#1F1B1A", script: "#3A3432", accent: "#B08D57" },
    }[variant] ?? { mark: "#1F1B1A", script: "#3A3432", accent: "#B08D57" };

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 460 130"
      width={w}
      height={h}
      className={className}
      style={{
        display: "block",
        "--vmb-mark": palette.mark,
        "--vmb-script": palette.script,
        "--vmb-accent": palette.accent,
      }}
    >
      <title>{title}</title>

      {/* VMB mark: taller + slightly thinner */}
      <g transform="translate(0 0) scale(1 1.10)">
        <text
          x={lockupCenterX}
          y="56"
          textAnchor="middle"
          fill="var(--vmb-mark)"
          fontFamily='"Baskerville Old Face", Baskerville, "Times New Roman", serif'
          fontSize="48"
          fontWeight="600"
          letterSpacing="1.2"
        >
          VMB
        </text>
      </g>

      {/* Script: more “luxury”, less cartoon */}
      <text
        x={lockupCenterX}
        y="95"
        textAnchor="middle"
        fill="var(--vmb-script)"
        fontFamily='"Lucida Calligraphy", "Lucida Handwriting", "Segoe Script", cursive'
        fontSize="28"
        fontWeight="400"
        fontStyle="italic"
        letterSpacing="0.2"
        opacity="0.95"
      >
        Ven Me Baby
      </text>

      {/* Accent dot (subtle) */}
      <circle cx="154" cy="18" r="3.5" fill="var(--vmb-accent)" opacity="0.9" />
    </svg>
  );
}
