import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const BUTTON_BASE =
  "grid h-10 min-w-10 place-items-center rounded-lg border border-border px-2.5 text-sm text-muted transition-colors";

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="페이지 목록"
    >
      <button
        type="button"
        className={cn(
          BUTTON_BASE,
          "enabled:hover:bg-surface enabled:hover:text-text disabled:cursor-not-allowed disabled:opacity-35",
        )}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onChangePage(currentPage - 1)}
      >
        <span className="icon-chevron-left size-5 bg-current" />
      </button>

      <ul className="flex items-center gap-2">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                BUTTON_BASE,
                page === currentPage
                  ? "border-accent bg-accent font-semibold text-white"
                  : "hover:bg-surface hover:text-text",
              )}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onChangePage(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={cn(
          BUTTON_BASE,
          "enabled:hover:bg-surface enabled:hover:text-text disabled:cursor-not-allowed disabled:opacity-35",
        )}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onChangePage(currentPage + 1)}
      >
        <span className="icon-chevron-right size-5 bg-current" />
      </button>
    </nav>
  );
}
