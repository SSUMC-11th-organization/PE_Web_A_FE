import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export const formInputClassName =
  "h-full w-full min-w-0 bg-transparent text-[15px] text-text outline-none placeholder:text-muted disabled:text-muted";

export const formActionButtonClassName =
  "shrink-0 px-1 text-[13px] font-semibold text-accent transition-opacity hover:opacity-70 disabled:text-muted disabled:hover:opacity-100";

export const formSubmitButtonClassName =
  "h-12 rounded-lg bg-accent text-[15px] font-semibold text-white transition-[filter,opacity] duration-200 ease-in-out hover:brightness-92 disabled:opacity-40 disabled:hover:brightness-100";

interface FormFieldProps {
  id: string;
  label: string;
  /** 입력칸 왼쪽에 보여줄 아이콘 경로 */
  icon?: string;
  isError?: boolean;
  /** 입력칸 아래 안내 문구. isError가 true면 빨간색으로 보여요. */
  message?: string;
  /** 입력칸 오른쪽에 붙는 버튼 (예: 중복 확인) */
  action?: ReactNode;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  icon,
  isError,
  message,
  action,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-lg border bg-white px-4 transition-colors has-[input:disabled]:bg-page",
          isError ? "border-red-500" : "border-border focus-within:border-accent",
        )}
      >
        {icon && <img src={icon} alt="" className="size-4 shrink-0 opacity-60" />}
        {children}
        {action}
      </div>
      {message && (
        <p
          id={`${id}-message`}
          className={cn("text-xs", isError ? "text-red-500" : "text-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
