const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ src, name, size = "md", className = "" }) {
  const dimension = sizeMap[size] || 40;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        width={dimension}
        height={dimension}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0 ${textSizeMap[size]} ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label={name || "Avatar"}
      role="img"
    >
      {getInitials(name)}
    </div>
  );
}
