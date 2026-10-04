import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const buttonClassName =
  "flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-ink-sub";

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        className={cn(buttonClassName, "disabled:opacity-30")}
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
      >
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={cn(buttonClassName, page === currentPage && "bg-ink text-white")}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className={cn(buttonClassName, "disabled:opacity-30")}
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
      >
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  );
}
