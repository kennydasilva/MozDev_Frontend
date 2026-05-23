import Icon from "./Icon";
import { useApp } from "../context/AppContext";

export default function AppBar({ title, onBack, rightContent, subtitle, showMenu }) {
  const { setMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-surface-100">
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showMenu && (
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors -ml-1.5"
              aria-label="Abrir menu"
            >
              <Icon name="menu" size={22} />
            </button>
          )}
          {!showMenu && onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors -ml-1.5"
              aria-label="Voltar"
            >
              <Icon name="arrowLeft" size={22} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="font-bold text-surface-800 text-base truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-surface-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center gap-1 shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}
