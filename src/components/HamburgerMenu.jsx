import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const menuGroups = [
  {
    label: "Principal",
    items: [
      { icon: "home", label: "Início", screen: "feed" },
      { icon: "search", label: "Pesquisar", screen: "search" },
      { icon: "notifications", label: "Notificações", screen: "notifications" },
      { icon: "profile", label: "Perfil", screen: "profile" },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { icon: "plus", label: "Publicar alerta", screen: "create" },
      { icon: "edit", label: "Minhas publicações", screen: "my-publications" },
      { icon: "bookmark", label: "Guardados", screen: "my-publications" },
      { icon: "messageCircle", label: "Mensagens", screen: "chat-list" },
    ],
  },
  {
    label: "Apoio",
    items: [
      { icon: "settings", label: "Configurações", screen: "settings" },
      { icon: "helpCircle", label: "Ajuda", screen: "settings" },
      { icon: "shield", label: "Sobre", screen: "settings" },
    ],
  },
];

export default function HamburgerMenu() {
  const { menuOpen, setMenuOpen, navigate, currentScreen } = useApp();

  if (!menuOpen) return null;

  const isActive = (screen) => {
    if (screen === "feed") return currentScreen === "feed";
    if (screen === "my-publications") return currentScreen === "my-publications";
    if (screen === "settings") return currentScreen === "settings";
    if (screen === "chat-list") return currentScreen === "chat-list";
    return currentScreen === screen;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[80vw] bg-white z-50 shadow-soft-lg slide-up flex flex-col"
        role="dialog"
        aria-label="Menu de navegação"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <Icon name="shield" size={18} className="text-primary-600" />
            </div>
            <span className="font-bold text-surface-800">Rede Alerta</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 transition-colors"
            aria-label="Fechar menu"
          >
            <Icon name="close" size={20} className="text-surface-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-widest px-2 mb-1">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.screen)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.screen)
                        ? "bg-primary-50 text-primary-700"
                        : "text-surface-600 hover:bg-surface-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive(item.screen)
                          ? "bg-primary-100 text-primary-600"
                          : "bg-surface-100 text-surface-400"
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                    </div>
                    <span>{item.label}</span>
                    {isActive(item.screen) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-surface-100">
          <p className="text-[11px] text-surface-400 text-center">
            Rede Alerta &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
}
