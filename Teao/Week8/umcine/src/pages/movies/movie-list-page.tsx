import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  return (
    <main className="mx-auto w-[min(100%-32px,1280px)] py-14 sm:py-20">
      <section className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-black tracking-[0.22em] text-umc">UMCINE COLLECTION</p>
          <h1 className="text-3xl font-black sm:text-4xl">영화 목록</h1>
        </div>
        <p className="text-sm text-white/50">총 {movies.length}편</p>
      </section>
      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-white/50">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="py-20 text-center text-red-300">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-white/50">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </main>
  );
}
