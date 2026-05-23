export function SkeletonCard() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/5 rounded-lg" />
        <div className="skeleton h-4 w-2/5 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-64 w-full" />
      <div className="screen-padding mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-5 w-2/5 rounded-lg" />
            <div className="skeleton h-4 w-4/5 rounded-lg" />
            <div className="skeleton h-4 w-3/5 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="skeleton h-12 w-full" />
      <div className="flex flex-col items-center gap-3 my-8">
        <div className="skeleton w-20 h-20 rounded-full" />
        <div className="skeleton h-6 w-32 rounded-lg" />
        <div className="skeleton h-4 w-48 rounded-lg" />
      </div>
    </div>
  )
}
