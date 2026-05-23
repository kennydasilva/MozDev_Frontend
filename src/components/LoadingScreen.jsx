export default function LoadingScreen({ message }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
      role="status"
      aria-label="A carregar"
    >
      <div className="relative">
        <div className="w-12 h-12 border-4 border-surface-200 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-surface-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
