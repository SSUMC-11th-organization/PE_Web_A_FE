import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        className="grid size-10 place-items-center rounded-full border border-white/10 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-4" src="/icons/chevron-left.svg" alt="" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          className={cn(
            "size-10 rounded-full text-sm font-semibold text-white/60 transition hover:bg-white/10",
            page === currentPage && "bg-umc text-white hover:bg-umc",
          )}
          type="button"
          key={page}
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="grid size-10 place-items-center rounded-full border border-white/10 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-4" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
