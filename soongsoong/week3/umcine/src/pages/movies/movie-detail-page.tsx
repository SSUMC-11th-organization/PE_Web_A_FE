import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

const STARS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex flex-1 flex-col items-center gap-3 py-[120px] text-ink-sub">
        <p>영화를 찾을 수 없어요.</p>
        <Link className="text-primary underline" to="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const {
    title,
    originalTitle,
    releaseDate,
    genres,
    runtime,
    posterPath,
    backdropPath,
    tagline,
    overview,
    isBookmarked,
  } = movie;

  return (
    <main className="flex-1">
      <section
        className="relative h-[360px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${backdropPath})` }}
      >
        <span
          className="absolute inset-0 bg-linear-to-r from-black/70 from-0% via-black/35 via-45% to-black/0 to-75%"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex h-full w-full max-w-[1280px] flex-col justify-between px-4 pt-[26px] pb-6 xl:px-0">
          <Link
            className="flex items-center gap-0.5 self-start text-[13px] font-bold text-white"
            to="/"
          >
            <img className="invert" src="/icons/chevron-left.svg" alt="" width={24} height={24} />
            영화 목록
          </Link>

          <div>
            <h1 className="text-5xl leading-[1.2] font-extrabold tracking-[-1.44px]">{title}</h1>
            <p className="mt-1.5 text-sm leading-normal">{originalTitle}</p>
            <p className="mt-2 flex gap-2 text-[13px] font-bold">
              <span>{releaseDate}</span>
              <span>{genres.join(" · ")}</span>
              <span>{runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[200px_1fr_360px] gap-8 px-4 pt-6 pb-16 xl:px-0">
        <img
          className="aspect-[200/285] w-[200px] rounded-lg object-cover shadow-[0_12px_24px_rgba(17,24,39,0.18)]"
          src={posterPath}
          alt={`${title} 포스터`}
        />

        <section>
          <h2 className="text-xl leading-normal font-extrabold tracking-[-0.4px]">{tagline}</h2>
          <p className="mt-3 text-[13px] leading-6 text-ink-sub">{overview}</p>
          <button
            className="mt-4 flex h-10 items-center gap-1.5 rounded-md bg-primary pr-4 pl-3.5 text-[13px] font-bold text-white"
            type="button"
          >
            <img
              className="size-5 invert"
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
            />
            즐겨찾기
          </button>
        </section>

        <aside className="min-h-[310px] self-start border-l border-line pl-8">
          <h2 className="text-xl leading-normal font-extrabold tracking-[-0.4px]">내 평점</h2>
          <p className="mt-2 text-[11px] text-ink-muted">별점은 필수, 후기는 선택이에요.</p>

          <form onSubmit={(event) => event.preventDefault()}>
            <div className="mt-2.5 flex gap-1">
              {STARS.map((star) => (
                <button
                  key={star}
                  className="flex size-[38px] items-center justify-center rounded-md border border-line bg-white text-[#4b5563]"
                  type="button"
                  aria-label={`${star}점`}
                >
                  <span className="size-6 bg-current mask-[url(/icons/star.svg)] mask-contain mask-center mask-no-repeat" />
                </button>
              ))}
            </div>
            <textarea
              className="mt-2.5 block h-[100px] w-full resize-none rounded-lg border border-line bg-white px-3 py-3.5 text-xs leading-normal text-ink placeholder:text-ink-muted"
              placeholder="영화를 보고 느낀 점을 남겨보세요."
            />
            <button
              className="mt-2.5 h-10 w-full rounded-md bg-ink text-[13px] font-bold text-white"
              type="submit"
            >
              평점 저장
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
