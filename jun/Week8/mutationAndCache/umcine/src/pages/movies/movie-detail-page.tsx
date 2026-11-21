import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MyRatingSection } from "../../components/movies/my-rating-section";
import { useFavoriteStatusQuery } from "../../hooks/use-favorite-queries";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { cn } from "../../utils/cn";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    // 미니 실습: 상세 조회는 전역 기본값(1분) 대신 30초 동안만 fresh로 취급해요.
    staleTime: 30 * 1000,
  });

  // 요청하지 않아도 isPending이 참일 수 있으므로 잘못된 번호를 먼저 처리해요.
  if (!isValidMovieId) {
    return <DetailStatus title="올바르지 않은 영화 번호예요." showBackLink />;
  }

  if (movieDetailQuery.isPending) {
    return <DetailStatus title="영화 정보를 불러오는 중이에요." />;
  }

  if (movieDetailQuery.isError) {
    return (
      <DetailStatus
        title={getMovieDetailErrorMessage(movieDetailQuery.error)}
        showBackLink
      />
    );
  }

  const movie = movieDetailQuery.data;

  // 다른 영화로 이동하면 즐겨찾기·평점 상태를 새로 시작해요.
  return <MovieDetail key={movie.id} movie={movie} />;
}

interface DetailStatusProps {
  title: string;
  showBackLink?: boolean;
}

function DetailStatus({ title, showBackLink = false }: DetailStatusProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
      <p className="text-lg font-semibold">{title}</p>
      {showBackLink && (
        <Link to="/" className="text-sm font-semibold text-accent hover:underline">
          영화 목록으로 돌아가기
        </Link>
      )}
    </main>
  );
}

function MovieDetail({ movie }: { movie: TmdbMovieDetail }) {
  // 상세에서는 이 영화 하나의 즐겨찾기 여부를 GET /favorites/{movieId}로 확인해요.
  const favoriteStatus = useFavoriteStatusQuery(movie.id);
  const isBookmarked = favoriteStatus.isFavorite;
  const { toggleFavorite, isPending: isFavoritePending } = useToggleFavoriteMutation();
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main className="flex-1">
      <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden px-5 pt-6 pb-8 text-white sm:px-12 xl:px-20">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-sub text-sm text-white/60">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

        <Link
          to="/"
          className="flex w-fit items-center gap-1 text-[13px] font-medium text-white/90 hover:text-white"
        >
          <img src="/icons/chevron-left.svg" alt="" className="size-4 invert" />
          영화 목록
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] leading-tight font-bold tracking-[-0.5px]">
            {movie.title}
          </h1>
          <p className="text-sm text-white/80">{movie.original_title}</p>
          <p className="flex flex-wrap items-center gap-x-3 text-[13px] font-semibold">
            <span>{movie.release_date.replaceAll("-", ".")}</span>
            <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-10 px-5 py-8 sm:px-12 lg:flex-row xl:px-20">
        <section className="flex flex-1 flex-col gap-8 sm:flex-row">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-2/3 w-[200px] shrink-0 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="flex aspect-2/3 w-[200px] shrink-0 items-center justify-center rounded-lg bg-surface-hover text-sm text-muted shadow-lg">
              이미지 없음
            </div>
          )}

          <div className="flex flex-col items-start gap-3">
            {movie.tagline && <h2 className="text-lg font-bold">{movie.tagline}</h2>}
            <p className="max-w-[640px] text-sm leading-relaxed text-sub">
              {movie.overview}
            </p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              disabled={favoriteStatus.isLoading || isFavoritePending}
              onClick={() => toggleFavorite(movie.id, isBookmarked)}
              className={cn(
                "mt-2 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition-[background-color,filter,opacity] duration-200 ease-in-out hover:brightness-92 disabled:opacity-60",
                isBookmarked ? "bg-text" : "bg-accent",
              )}
            >
              <img
                src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                className="size-4 invert"
              />
              {isBookmarked ? "즐겨찾기됨" : "즐겨찾기"}
            </button>
          </div>
        </section>

        <aside className="w-full lg:w-[360px] lg:shrink-0 lg:border-l lg:border-border lg:pl-8">
          <MyRatingSection movieId={movie.id} />
        </aside>
      </div>
    </main>
  );
}
