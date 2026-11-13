import { Link } from "@tanstack/react-router";

export function MemberPage() {
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
            T
          </div>
          <dl className="grid content-center gap-5">
            <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 pb-4">
              <dt className="text-slate-500">닉네임</dt>
              <dd className="font-bold">테오</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 pb-4">
              <dt className="text-slate-500">이메일</dt>
              <dd className="font-bold">teao@example.com</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <dt className="text-slate-500">가입일</dt>
              <dd className="font-bold">2026. 11. 13.</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
