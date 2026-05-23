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

export default function StatusBadge({ status = "desaparecido", size = "md" }) {
  const config = statusConfig[status] || statusConfig.desaparecido;
  const iconSize = size === "sm" ? 12 : 14;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "";

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
