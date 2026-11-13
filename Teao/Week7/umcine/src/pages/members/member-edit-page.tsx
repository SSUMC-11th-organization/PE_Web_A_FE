import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthField } from "../../components/auth/auth-field";

export function MemberEditPage() {
  const [nickname, setNickname] = useState("테오");
  const [email, setEmail] = useState("teao@example.com");
  const [savedMessage, setSavedMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage(`${nickname} / ${email}로 입력값이 반영됐어요.`);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fb] px-4 py-20 text-slate-950">
      <form className="mx-auto w-full max-w-lg space-y-6" onSubmit={handleSubmit}>
        <h1 className="mb-10 text-3xl font-black">내 정보 수정</h1>
        <AuthField label="닉네임" value={nickname} onChange={setNickname} />
        <AuthField label="이메일" type="email" value={email} onChange={setEmail} />
        <div className="flex gap-3">
          <Link className="flex-1 rounded-md border border-slate-300 py-3.5 text-center font-bold" to="/mypage">
            취소
          </Link>
          <button className="flex-1 rounded-md bg-umc py-3.5 font-bold text-white" type="submit">
            저장하기
          </button>
        </div>
        {savedMessage && <p className="text-center text-sm font-semibold text-umc">{savedMessage}</p>}
      </form>
    </main>
  );
}
