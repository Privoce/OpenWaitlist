import { BRAND_NAME, DEMO_TAGLINE } from "@/lib/brand";
import { DemoBanner } from "@/components/DemoBanner";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

export function KioskShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-50">
      <DemoBanner compact />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

export function KioskTopBar({
  onBack,
  backLabel = "← Back",
}: {
  onBack: () => void;
  backLabel?: string;
}) {
  return (
    <div className="px-6 pt-4 pb-2">
      <button
        type="button"
        onClick={onBack}
        className="text-gray-500 hover:text-gray-800 text-base font-medium transition-colors"
      >
        {backLabel}
      </button>
    </div>
  );
}

export function KioskTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-6 pb-4 text-center sm:text-left">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {subtitle ?? `${BRAND_NAME} · ${DEMO_TAGLINE}`}
      </p>
    </div>
  );
}

export function KioskPrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-md rounded-full bg-brand-primary py-4 text-lg font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-primary-dark active:scale-[0.99] disabled:opacity-60 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

export function KioskFooter({
  children,
  showPoweredBy = true,
}: {
  children?: React.ReactNode;
  showPoweredBy?: boolean;
}) {
  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4 pb-6">
      {children ? <div className="flex justify-center">{children}</div> : null}
      {showPoweredBy ? (
        <div className={`flex justify-center ${children ? "mt-5" : ""}`}>
          <PoweredBy variant="light" />
        </div>
      ) : null}
    </div>
  );
}

export function KioskFieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-medium text-gray-600">
      {children}
      {required ? <span className="text-brand-primary"> *</span> : null}
    </label>
  );
}

export function KioskTextInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-lg text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
    />
  );
}

export function KioskTapField({
  active,
  disabled,
  onClick,
  children,
  placeholder,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-2 w-full rounded-xl border px-4 py-3.5 text-left text-lg outline-none transition-colors ${
        active
          ? "border-brand-primary bg-brand-gold-light/20 ring-2 ring-brand-primary/15"
          : "border-gray-200 bg-white"
      } ${disabled ? "text-gray-400" : "text-gray-900"}`}
    >
      {children || placeholder}
    </button>
  );
}

export function KioskKeypad({
  onKey,
}: {
  onKey: (key: string) => void;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

  return (
    <div className="grid grid-cols-3 gap-2 border-t border-gray-200 bg-gray-100 p-4">
      {keys.map((key) => {
        if (key === "") return <div key="empty" />;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onKey(key)}
            className={`h-14 rounded-xl text-xl font-medium transition-colors ${
              key === "back"
                ? "bg-brand-primary text-white hover:bg-brand-primary-dark"
                : "bg-white text-gray-800 shadow-sm hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            {key === "back" ? "⌫" : key}
          </button>
        );
      })}
    </div>
  );
}

export function KioskError({ message }: { message: string }) {
  return (
    <div className="px-6 pb-4">
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {message}
      </p>
    </div>
  );
}