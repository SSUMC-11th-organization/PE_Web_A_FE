import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  FormField,
  formInputClassName,
  formSubmitButtonClassName,
} from "../../components/auth/form-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const loginMutation = useLoginMutation();
  // 이메일 형식이 맞고 비밀번호를 입력했을 때만 제출할 수 있어요.
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-[428px]">
        <h1 className="text-[32px] font-bold tracking-[-0.6px] text-text">
          로그인
        </h1>

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col">
          <div className="flex flex-col gap-4">
            <FormField id="email" label="이메일" icon="/icons/mail.svg">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={formInputClassName}
              />
            </FormField>

            <FormField id="password" label="비밀번호" icon="/icons/lock.svg">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className={formInputClassName}
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className={`mt-5 ${formSubmitButtonClassName}`}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
