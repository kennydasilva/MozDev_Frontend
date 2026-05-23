import Icon from "./Icon";

const navVariants = {
  classic: [
    { key: "inicio", icon: "home", label: "Início" },
    { key: "pesquisar", icon: "search", label: "Pesquisar" },
    { key: "publicar", icon: "plus", label: "Publicar", prominent: true },
    { key: "notificacoes", icon: "notifications", label: "Notificações" },
    { key: "perfil", icon: "profile", label: "Perfil" },
  ],
  mock: [
    { key: "inicio", icon: "home", label: "Início" },
    { key: "pesquisar", icon: "search", label: "Pesquisar" },
    { key: "alertas", icon: "notifications", label: "Alertas" },
    { key: "perfil", icon: "profile", label: "Perfil" },
  ],
};

export default function BottomNav({
  active = "inicio",
  onNavigate,
  variant = "classic",
}) {
  const navItems = navVariants[variant] || navVariants.classic;
  const effectiveActive =
    variant === "mock" && active === "notificacoes" ? "alertas" : active;
  const hideActiveIndicator = variant === "mock";

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-surface-100 px-3 pb-[env(safe-area-inset-bottom,8px)] pt-2 z-50"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = effectiveActive === item.key;
          const isProminent = item.prominent;

          if (isProminent) {
            return (
              <button
                key={item.key}
                onClick={() => onNavigate?.(item.key)}
                className="flex flex-col items-center justify-center gap-0.5 -mt-5"
                aria-label={item.label}
              >
                <div className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-soft-md hover:bg-primary-600 active:scale-95 transition-all duration-200">
                  <Icon name={item.icon} size={24} />
                </div>
                <span className="text-[10px] font-medium text-surface-500 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              className={`bottom-nav-item ${isActive ? "active" : ""} ${
                hideActiveIndicator ? "no-indicator" : ""
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon name={item.icon} size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
