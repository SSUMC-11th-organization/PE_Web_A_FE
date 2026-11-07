import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB는 total_pages를 500까지 내려줘요.
// Pagination이 모든 페이지 번호를 그리므로 화면에 보여줄 최대 페이지 수를 제한해요.
const MAX_VISIBLE_PAGES = 5;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_VISIBLE_PAGES);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  function renderContent() {
    if (moviesQuery.isPending) {
      return <StatusMessage title="영화 목록을 불러오는 중이에요." />;
    }

    if (moviesQuery.isError) {
      return (
        <StatusMessage
          title="영화 목록을 불러오지 못했어요."
          description={moviesQuery.error.message}
        />
      );
    }

    if (movies.length === 0) {
      return <StatusMessage title="조건에 맞는 영화가 없어요." />;
    }

    return (
      <>
        <MovieGrid movies={movies} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  return (
    <main className="flex-1 px-5 pt-6 pb-10 sm:px-12 sm:pt-10 sm:pb-16 xl:px-20">
      <section>
        <h1 className="mb-6 text-[28px] font-bold tracking-[-0.3px]">영화 목록</h1>

        {renderContent()}
      </section>
    </main>
  );
}

interface StatusMessageProps {
  title: string;
  description?: string;
}

function StatusMessage({ title, description }: StatusMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-center">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  );
}
