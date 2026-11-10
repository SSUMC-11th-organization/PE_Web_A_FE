import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { ProfileAvatar } from "../../components/me/profile-avatar";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useMeStore } from "../../stores/me-store";

const BOOKMARKS_PER_PAGE = 10;

export function MyPage() {
  const profile = useMeStore((state) => state.profile);
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(bookmarkedMovieIds.length / BOOKMARKS_PER_PAGE),
  );
  // 북마크를 해제해 마지막 페이지가 사라지면 남은 마지막 페이지를 보여줘요.
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * BOOKMARKS_PER_PAGE,
    currentPage * BOOKMARKS_PER_PAGE,
  );

  // 북마크에는 영화 id만 저장되어 있어서, 현재 페이지의 영화 정보만 상세 API로 불러와요.
  // queryKey를 상세 페이지와 같게 맞춰 이미 본 영화는 캐시를 재사용해요.
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  const isLoading = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);
  const movies = movieQueries.flatMap((query) => (query.data ? [query.data] : []));

  function renderBookmarks() {
    if (bookmarkedMovieIds.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-muted">아직 즐겨찾기한 영화가 없어요.</p>
          <Link to="/" className="text-sm font-semibold text-accent hover:underline">
            영화 둘러보기
          </Link>
        </div>
      );
    }

    if (isLoading) {
      return (
        <p className="py-16 text-center text-sm text-muted">
          즐겨찾기한 영화를 불러오는 중이에요.
        </p>
      );
    }

    return (
      <>
        {isError && (
          <p className="mb-4 text-sm text-red-500">
            일부 영화 정보를 불러오지 못했어요.
          </p>
        )}
        <MovieGrid movies={movies} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </>
    );
  }

  return (
    <main className="flex-1 px-5 pt-6 pb-10 sm:px-12 sm:pt-10 sm:pb-16 xl:px-20">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-[28px] font-bold tracking-[-0.3px]">내 정보</h1>
        <Link
          to="/me/edit"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-[filter] duration-200 ease-in-out hover:brightness-92"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-border py-6">
        <h2 className="text-base font-bold">기본 정보</h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ProfileAvatar imageUrl={profile.profileImageUrl} className="size-16" />
          <dl className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">닉네임</dt>
              <dd className="mt-1 font-bold text-text">{profile.nickname}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">이메일</dt>
              <dd className="mt-1 font-bold break-all text-text">{profile.email}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pt-6">
        <h2 className="mb-4 text-base font-bold">내 즐겨찾기</h2>
        {renderBookmarks()}
      </section>
    </main>
  );
}
