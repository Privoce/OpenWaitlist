export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin-slow" />
      {label ? <p className="text-sm text-gray-500">{label}</p> : null}
    </div>
  );
}
