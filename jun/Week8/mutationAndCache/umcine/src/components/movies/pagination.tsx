import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const arrowClassName =
  "flex size-9 items-center justify-center rounded-full border border-border bg-white transition-[background-color,opacity] duration-200 ease-in-out enabled:hover:bg-surface-hover disabled:opacity-35";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-4"
      aria-label="페이지 네비게이션"
    >
      <button
        type="button"
        className={arrowClassName}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" className="size-4 opacity-75" />
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((page) => {
          const isCurrent = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                className={cn(
                  "flex size-8 items-center justify-center rounded-full font-semibold transition-colors duration-200 ease-in-out",
                  isCurrent
                    ? "bg-accent-bg text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-text",
                )}
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={arrowClassName}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" className="size-4 opacity-75" />
      </button>
    </nav>
  );
}
