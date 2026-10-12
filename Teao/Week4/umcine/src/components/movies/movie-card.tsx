import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <li className="min-w-0">
      <div className="group relative overflow-hidden rounded-2xl bg-white/5 shadow-2xl shadow-black/20">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <BookmarkButton className="absolute right-3 top-3 size-10" movieId={movie.id} title={movie.title} />
      </div>

      <div className="pt-4">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h3 className="truncate text-base font-bold text-white hover:text-umc">{movie.title}</h3>
        </Link>
        <p className="mt-1 truncate text-sm text-white/45">{movie.originalTitle}</p>
        <p className="mt-2 flex flex-wrap gap-1 text-xs text-white/55">
          <span>{movie.releaseDate}</span>
          <span aria-hidden="true">·</span>
          <span>{movie.genres.join(", ")}</span>
        </p>
      </div>
    </li>
  );
}
