export function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-border bg-white px-5 py-5 sm:px-12 xl:px-20">
      <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3" />
      <p className="text-xs text-muted">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-text"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
