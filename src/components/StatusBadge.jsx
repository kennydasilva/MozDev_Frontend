import Icon from "./Icon";

const statusConfig = {
  desaparecido: {
    icon: "alert",
    class: "status-desaparecido",
    label: "Desaparecido",
  },
  encontrado: {
    icon: "checkCircle",
    class: "status-encontrado",
    label: "Encontrado",
  },
  "em-verificacao": {
    icon: "clock",
    class: "status-verificacao",
    label: "Em Verificação",
  },
};

export default function StatusBadge({
  status = "desaparecido",
  size = "md",
  variant = "chip",
}) {
  const config = statusConfig[status] || statusConfig.desaparecido;
  const iconSize = size === "sm" ? 12 : 14;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "";

  const plainTextSize = size === "sm" ? "text-[10px]" : "text-xs";
  const plainColor =
    status === "encontrado"
      ? "text-success-600"
      : status === "em-verificacao"
        ? "text-amber-600"
        : "text-alert-600";

  if (variant === "plain") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold ${plainTextSize} ${plainColor}`}
        aria-label={`Status: ${config.label}`}
      >
        <Icon name={config.icon} size={iconSize} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`status-chip ${config.class} ${paddingClass}`}
      aria-label={`Status: ${config.label}`}
    >
      <Icon name={config.icon} size={iconSize} />
      {config.label}
    </span>
  );
}
