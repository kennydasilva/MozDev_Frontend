import Icon from "./Icon";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
      role="status"
    >
      {icon && (
        <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mb-5">
          <Icon name={icon} size={36} className="text-surface-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-bold text-surface-700 mb-1.5">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-surface-400 leading-relaxed max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-5 !w-auto px-6"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
