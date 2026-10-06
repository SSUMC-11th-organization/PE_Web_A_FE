import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute top-2.5 right-2.5 z-10 size-9 rounded-full backdrop-blur-sm hover:scale-[1.08]"
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-[rgba(10,11,15,0.95)] via-[rgba(10,11,15,0.7)] to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-[13px] font-semibold text-accent">
            {movie.tagline}
          </p>
          <p className="line-clamp-4 text-[12.5px] leading-relaxed text-text/85">
            {movie.overview}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] leading-snug font-semibold">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
            {movie.title}
          </Link>
        </h3>
        <p className="text-xs text-muted">{movie.originalTitle}</p>
        <p className="mt-0.5 text-xs text-muted">
          {movie.releaseDate} · {movie.runtime}
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {movie.genres.map((genre) => (
            <li
              key={genre}
              className="rounded-full border border-border bg-surface px-2.5 py-[3px] text-[11px] text-muted"
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
