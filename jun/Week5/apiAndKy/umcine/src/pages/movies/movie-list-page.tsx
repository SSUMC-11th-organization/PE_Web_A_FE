import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  function renderContent() {
    if (isLoading) {
      return <StatusMessage title="영화 목록을 불러오는 중이에요." />;
    }

    if (errorMessage) {
      return (
        <StatusMessage
          title={errorMessage}
          description="잠시 후 다시 시도해 주세요."
        />
      );
    }

    if (movies.length === 0) {
      return <StatusMessage title="조건에 맞는 영화가 없어요." />;
    }

    return (
      <>
        <MovieGrid movies={pageMovies} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
