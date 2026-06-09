const BADGES = [
  {
    icon: "📍",
    text: "Based in Kitchener-Waterloo (Local Pickup Available)",
  },
  {
    icon: "📦",
    text: "Flat-rate Lettermail Shipping Across Canada for Small Items",
  },
  {
    icon: "🚗",
    text: "Automotive Parts: PETG/ABS Material Recommended for Heat Resistance",
  },
];

export default function LocationBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      {BADGES.map((badge) => (
        <span
          key={badge.text}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm"
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.text}
        </span>
      ))}
    </div>
  );
}
