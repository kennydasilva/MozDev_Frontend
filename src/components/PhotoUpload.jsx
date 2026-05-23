import { useState } from "react"
import Icon from "./Icon"

export default function PhotoUpload({ onUpload, currentImage, className = "" }) {
  const [showMenu, setShowMenu] = useState(false)

  function triggerFile(accept, capture) {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    if (capture) input.capture = "environment"
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) onUpload?.(file)
    }
    input.click()
  }

  function handleClick() {
    if ('mediaDevices' in navigator) {
      setShowMenu(true)
    } else {
      triggerFile("image/*")
    }
  }

  function handleGallery() {
    setShowMenu(false)
    triggerFile("image/*")
  }

  function handleCamera() {
    setShowMenu(false)
    triggerFile("image/*", true)
  }

  return (
    <>
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

      {showMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-mobile p-6 pb-10 animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-surface-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold text-surface-800 text-center mb-5">
              Adicionar foto
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleCamera}
                className="flex-1 flex flex-col items-center gap-3 py-6 rounded-2xl bg-surface-50 hover:bg-surface-100 transition-colors active:scale-[0.97]"
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
                  <Icon name="camera" size={26} className="text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-surface-700">Câmara</span>
                <span className="text-[11px] text-surface-400">Tirar foto agora</span>
              </button>
              <button
                onClick={handleGallery}
                className="flex-1 flex flex-col items-center gap-3 py-6 rounded-2xl bg-surface-50 hover:bg-surface-100 transition-colors active:scale-[0.97]"
              >
                <div className="w-14 h-14 rounded-full bg-surface-100 flex items-center justify-center">
                  <Icon name="image" size={26} className="text-surface-500" />
                </div>
                <span className="text-sm font-semibold text-surface-700">Galeria</span>
                <span className="text-[11px] text-surface-400">Escolher do dispositivo</span>
              </button>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="w-full mt-4 py-3.5 bg-surface-100 text-surface-600 font-semibold rounded-2xl text-sm hover:bg-surface-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
