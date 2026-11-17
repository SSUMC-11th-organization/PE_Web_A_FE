import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../api/favorites";
import { getMe } from "../../api/members/me";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR").format(new Date(date));
}

export function MemberPage() {
  const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe });
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
  });

  if (meQuery.isPending) {
    return <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f7f8fb] text-slate-950">내 정보를 불러오는 중이에요.</main>;
  }

  if (meQuery.isError) {
    return <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f7f8fb] text-red-600">내 정보를 불러오지 못했어요.</main>;
  }

  const member = meQuery.data;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fb] px-4 py-20 text-slate-950">
      <section className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-black">내 정보</h1>
          <Link className="rounded-md bg-umc px-5 py-3 text-sm font-bold text-white" to="/mypage/edit">
            정보 수정
          </Link>
        </div>
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 md:grid-cols-[160px_1fr]">
          <div className="grid size-32 place-items-center rounded-full bg-violet-100 text-4xl font-black text-umc">
            {member.nickname.slice(0, 1)}
          </div>
          <dl className="grid content-center gap-5">
            <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 pb-4">
              <dt className="text-slate-500">닉네임</dt>
              <dd className="font-bold">{member.nickname}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 pb-4">
              <dt className="text-slate-500">이메일</dt>
              <dd className="font-bold">{member.email}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <dt className="text-slate-500">가입일</dt>
              <dd className="font-bold">{formatDate(member.createdAt)}</dd>
            </div>
          </dl>
        </div>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-black">내 즐겨찾기</h2>
          {favoritesQuery.isPending ? (
            <p className="mt-4 text-slate-500">불러오는 중이에요.</p>
          ) : favoritesQuery.data?.length ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {favoritesQuery.data.map((favorite) => (
                <li key={favorite.favoriteId}>
                  <Link className="rounded-full bg-violet-100 px-4 py-2 font-bold text-umc" to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                    영화 #{favorite.movieId}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-500">즐겨찾기한 영화가 없어요.</p>
          )}
        </section>
      </section>
    </main>
  );
}
