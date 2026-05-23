import Icon from "./Icon";

export default function PhotoUpload({ onUpload, currentImage, className = "" }) {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload?.(file);
      }
    };
    input.click();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed
        flex flex-col items-center justify-center gap-2
        transition-all duration-200 overflow-hidden
        ${
          currentImage
            ? "border-surface-200 bg-surface-50"
            : "border-surface-300 bg-surface-50 hover:border-primary-400 hover:bg-primary-50/30"
        }
        ${className}
      `}
      aria-label={currentImage ? "Alterar foto" : "Adicionar foto"}
    >
      {currentImage ? (
        <>
          <img
            src={currentImage}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center gap-1 text-white">
              <Icon name="camera" size={28} />
              <span className="text-xs font-medium">Alterar foto</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center">
            <Icon name="camera" size={24} className="text-surface-500" />
          </div>
          <span className="text-sm font-medium text-surface-500">
            Adicionar foto
          </span>
          <span className="text-[10px] text-surface-400">
            PNG, JPG ou WEBP
          </span>
        </>
      )}
    </button>
  );
}
