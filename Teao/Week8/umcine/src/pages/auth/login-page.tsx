import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthField } from "../../components/auth/auth-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fb] px-4 py-28 text-slate-950">
      <form className="mx-auto w-full max-w-md space-y-5" onSubmit={handleSubmit}>
        <h1 className="mb-10 text-center text-3xl font-black">로그인</h1>
        <AuthField
          label="이메일"
          type="email"
          value={email}
          placeholder="name@example.com"
          onChange={setEmail}
        />
        <AuthField
          label="비밀번호"
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={setPassword}
        />
        <button
          className="w-full rounded-md bg-umc py-3.5 font-bold text-white disabled:bg-slate-300"
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
        <p className="text-center text-sm text-slate-500">
          아직 계정이 없나요?{" "}
          <Link className="font-bold text-umc" to="/signup">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
