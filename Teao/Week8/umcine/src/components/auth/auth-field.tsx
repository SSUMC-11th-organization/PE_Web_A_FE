interface AuthFieldProps {
  label: string;
  type?: "email" | "password" | "text";
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  action?: {
    label: string;
    disabled: boolean;
    onClick: () => void;
  };
  onChange: (value: string) => void;
}

export function AuthField({
  label,
  type = "text",
  value,
  placeholder,
  error,
  disabled,
  action,
  onChange,
}: AuthFieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <span className="mt-2 flex rounded-md border border-slate-200 bg-white focus-within:border-umc">
        <input
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-normal outline-none placeholder:text-slate-400 disabled:bg-slate-100"
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        {action && (
          <button
            className="px-4 text-xs font-bold text-umc disabled:text-slate-300"
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </span>
      {error && <span className="mt-1 block text-xs font-normal text-red-500">{error}</span>}
    </label>
  );
}
