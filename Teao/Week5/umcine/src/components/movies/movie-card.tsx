import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <li className="min-w-0">
      <div className="group relative overflow-hidden rounded-2xl bg-white/5 shadow-2xl shadow-black/20">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {posterUrl ? (
            <img
              className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="grid aspect-[2/3] place-items-center bg-white/5 text-sm text-white/40">
              이미지 없음
            </div>
          )}
        </Link>
        <BookmarkButton className="absolute right-3 top-3 size-10" movieId={movie.id} title={movie.title} />
      </div>

      <div className="pt-4">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h3 className="truncate text-base font-bold text-white hover:text-umc">{movie.title}</h3>
        </Link>
        <p className="mt-1 truncate text-sm text-white/45">{movie.original_title}</p>
        <p className="mt-2 flex flex-wrap gap-1 text-xs text-white/55">
          <span>{movie.release_date || "개봉일 미정"}</span>
          <span aria-hidden="true">·</span>
          <span>평점 {movie.vote_average.toFixed(1)}</span>
        </p>
      </div>
    </li>
  );
}
