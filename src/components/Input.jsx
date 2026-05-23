import Icon from "./Icon";

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  icon,
  className = "",
  multiline = false,
  rows = 4,
}) {
  const Component = multiline ? "textarea" : "input";
  const inputClasses = `input-field ${icon ? "pl-11" : ""} ${
    multiline ? "resize-none" : ""
  } ${error ? "border-alert-500 ring-2 ring-alert-100" : ""}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <Icon name={icon} size={20} />
          </div>
        )}
        <Component
          type={multiline ? undefined : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={multiline ? rows : undefined}
          className={inputClasses}
          aria-label={label || placeholder}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <span className="text-xs text-alert-500 font-medium flex items-center gap-1">
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}
