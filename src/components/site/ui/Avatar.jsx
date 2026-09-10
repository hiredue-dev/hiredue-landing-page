/**
 * Placeholder avatar: initials on a deterministic colored circle.
 * Swap for real user photos once we have them.
 */
const PALETTE = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#3B82F6",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsFor(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, size = 50, className = "" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-medium text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: colorFor(name),
      }}
    >
      {initialsFor(name)}
    </span>
  );
}
