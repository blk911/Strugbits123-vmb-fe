/**
 * @param {string} rawName
 * @returns {{ service_category: string; service_family: string; confidence: number }}
 */
export function classifyService(rawName) {
  const s = String(rawName ?? "").toLowerCase();
  const hit = (words, cat, fam, conf = 0.75) => {
    for (const w of words) {
      if (s.includes(w)) return { service_category: cat, service_family: fam, confidence: conf };
    }
    return null;
  };

  return (
    hit(["balayage", "blonding", "highlight", "foil", "toner", "tone "], "balayage", "color", 0.85) ||
    hit(["color", "root", "gloss", "demi"], "color", "color", 0.8) ||
    hit(["cut", "haircut", "trim", "blowout", "blow dry", "style"], "haircut", "haircut", 0.8) ||
    hit(["mani", "manicure", "pedi", "pedicure", "gel", "acrylic", "dip"], "nails", "nails", 0.82) ||
    hit(["lash", "lashes"], "lashes", "lashes", 0.8) ||
    hit(["brow"], "brows", "brows", 0.75) ||
    hit(["facial", "peel", "skin"], "skin", "skin", 0.78) ||
    hit(["wax"], "waxing", "waxing", 0.8) ||
    hit(["product", "retail"], "retail", "retail", 0.7) || {
      service_category: "other",
      service_family: "other",
      confidence: 0.4,
    }
  );
}
