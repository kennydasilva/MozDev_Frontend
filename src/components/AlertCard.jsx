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
      className={`card w-full text-left p-4 shadow-soft-md rounded-3xl ${
        onClick ? "cursor-pointer active:scale-[0.99] transition-transform" : ""
      }`}
      aria-label={`Ver detalhes do alerta de ${alert.name}`}
    >
      <div className="flex gap-4 items-stretch">
        <div className="relative shrink-0 w-[132px] self-stretch rounded-2xl overflow-hidden bg-surface-100">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={alert.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full min-h-[132px] bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
              <span className="text-surface-600 font-extrabold text-2xl">
                {getInitials(alert.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0" />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onComment?.(alert);
                }}
                className="flex items-center justify-center w-9 h-9 rounded-2xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
                aria-label="Comentar"
              >
                <Icon name="comment" size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(alert);
                }}
                className="flex items-center justify-center w-9 h-9 rounded-2xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
                aria-label="Partilhar"
              >
                <Icon name="share" size={20} />
              </button>
            </div>
          </div>

          <h3 className="mt-3 text-[26px] leading-tight font-extrabold text-surface-900 truncate">
            {alert.name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-surface-500">
            <div className="flex items-center gap-1.5">
              <Icon name="user" size={16} className="text-surface-400" />
              <span>{age} anos</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <div className="flex items-center gap-1.5 min-w-0">
              <Icon
                name={sexToIcon(alert.sexo)}
                size={16}
                className="text-surface-400"
              />
              <span className="truncate">{alert.sexo}</span>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-surface-600">
            <Icon
              name="location"
              size={16}
              className="mt-0.5 shrink-0 text-primary-500"
            />
            <span className="truncate">{alert.lastSeen}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-surface-500">
            <Icon name="calendar" size={16} className="text-surface-400" />
            <span>Desaparecido a {formatDateDMY(alert.dateMissing)}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-center gap-2 text-primary-600 font-semibold">
            <span>Ver detalhes</span>
            <Icon name="arrowRight" size={18} className="text-primary-600" />
          </div>
        </div>
      </div>
    </article>
  );
}
