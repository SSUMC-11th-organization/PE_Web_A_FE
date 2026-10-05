import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(query);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = normalizedQuery
    ? movies.filter((movie) =>
        [movie.title, movie.originalTitle].some((title) =>
          title.toLocaleLowerCase().includes(normalizedQuery),
        ),
      )
    : [];

  return (
    <main className="mx-auto min-h-[calc(100vh-180px)] w-[min(100%-32px,1280px)] py-14 sm:py-20">
      <h1 className="text-3xl font-black sm:text-4xl">영화 검색</h1>
      <form
        className="mt-8 flex max-w-2xl gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate({ search: { query: input.trim() } });
        }}
      >
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 focus-within:border-umc">
          <img className="size-5 opacity-50" src="/icons/search.svg" alt="" />
          <input
            className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/30"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="영화 제목을 입력해 주세요"
          />
        </label>
        <button className="rounded-2xl bg-umc px-6 font-bold transition hover:brightness-110" type="submit">
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-16 text-white/50">검색어를 입력해 주세요.</p>
      ) : results.length === 0 ? (
        <p className="mt-16 text-white/50">검색 결과가 없어요.</p>
      ) : (
        <section className="mt-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/50">검색어</p>
              <h2 className="mt-1 text-2xl font-bold">‘{query}’</h2>
            </div>
            <p className="text-sm text-white/50">결과 {results.length}개</p>
          </div>
          <MovieGrid movies={results} />
        </section>
      )}
    </main>
  );
}
