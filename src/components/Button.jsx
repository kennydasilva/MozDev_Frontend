export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: IconComponent,
  disabled = false,
  onClick,
  type = "button",
  fullWidth = true,
}) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    danger: "btn-danger",
    ghost:
      "w-full py-3.5 bg-transparent text-surface-600 font-semibold rounded-2xl text-sm transition-all duration-200 active:scale-[0.98] hover:bg-surface-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      aria-disabled={disabled}
    >
      {IconComponent && <IconComponent size={18} />}
      {children}
    </button>
  );
}
