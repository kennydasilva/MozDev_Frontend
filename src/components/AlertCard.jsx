import Icon from "./Icon";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDateDMY(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function sexToIcon(sex) {
  const normalized = String(sex || "").toLowerCase();
  if (normalized.startsWith("m")) return "male";
  if (normalized.startsWith("f")) return "female";
  return "user";
}

export default function AlertCard({ alert, onClick, onComment, onShare }) {
  if (!alert) return null;

  const age = alert.idade ?? alert.age;
  const photoSrc = alert.photo || alert.photoUrl || alert.image;

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <article
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      className={`card w-full text-left p-3 shadow-soft-md rounded-2xl ${
        onClick ? "cursor-pointer active:scale-[0.99] transition-transform" : ""
      }`}
      aria-label={`Ver detalhes do alerta de ${alert.name}`}
    >
      <div className="flex gap-3 items-stretch">
        <div className="relative shrink-0 w-[100px] self-stretch rounded-xl overflow-hidden bg-surface-100">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={alert.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full min-h-[100px] bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
              <span className="text-surface-500 font-bold text-base">
                {getInitials(alert.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] leading-tight font-bold text-surface-900 truncate">
                {alert.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-surface-400">
                <span>{age} anos</span>
                <span className="w-1 h-1 rounded-full bg-surface-300" />
                <span className="truncate">{alert.sexo}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onComment?.(alert);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
                aria-label="Comentar"
              >
                <Icon name="comment" size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(alert);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
                aria-label="Partilhar"
              >
                <Icon name="share" size={16} />
              </button>
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-surface-500">
            <div className="flex items-center gap-1 min-w-0">
              <Icon name="location" size={13} className="shrink-0 text-primary-400" />
              <span className="truncate">{alert.lastSeen}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-surface-400 mt-1">
            <Icon name="calendar" size={12} className="shrink-0" />
            <span>{formatDateDMY(alert.dateMissing)}</span>
          </div>

          <div className="mt-2 pt-2 border-t border-surface-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary-600">Ver detalhes</span>
            <Icon name="arrowRight" size={14} className="text-primary-500" />
          </div>
        </div>
      </div>
    </article>
  );
}
