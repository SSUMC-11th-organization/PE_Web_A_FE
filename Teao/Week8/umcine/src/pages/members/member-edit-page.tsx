import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { AuthField } from "../../components/auth/auth-field";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MemberEditPage() {
  const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe });
  const updateMeMutation = useUpdateMeMutation();
  const [changedNickname, setChangedNickname] = useState<string | null>(null);
  const nickname = changedNickname ?? meQuery.data?.nickname ?? "";
  const canSubmit = nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;
    updateMeMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fb] px-4 py-20 text-slate-950">
      <form className="mx-auto w-full max-w-lg space-y-6" onSubmit={handleSubmit}>
        <h1 className="mb-10 text-3xl font-black">내 정보 수정</h1>
        <AuthField label="닉네임" value={nickname} onChange={setChangedNickname} />
        <AuthField label="이메일" type="email" value={meQuery.data?.email ?? ""} disabled onChange={() => undefined} />
        <div className="flex gap-3">
          <Link className="flex-1 rounded-md border border-slate-300 py-3.5 text-center font-bold" to="/mypage">
            취소
          </Link>
          <button className="flex-1 rounded-md bg-umc py-3.5 font-bold text-white disabled:bg-slate-300" type="submit" disabled={!canSubmit || updateMeMutation.isPending}>
            {updateMeMutation.isPending ? "저장 중" : "저장하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
