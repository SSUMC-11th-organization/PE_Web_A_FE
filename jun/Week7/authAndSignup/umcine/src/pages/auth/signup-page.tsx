import { Link } from "@tanstack/react-router";
import { useState, type ReactNode, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 3.4에서 회원가입 API 요청 추가
  };

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-[428px]">
        <h1 className="text-[32px] font-bold tracking-[-0.6px] text-text">
          회원가입
        </h1>

        {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col">
          <div className="flex flex-col gap-4">
            <FormField
              id="email"
              label="이메일"
              isError={showEmailError}
              message={showEmailError ? "올바른 이메일 형식이 아니에요." : undefined}
              action={
                <button
                  type="button"
                  disabled={!isEmailValid}
                  className={actionButtonClassName}
                >
                  중복 확인
                </button>
              }
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-message" : undefined}
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="nickname"
              label="닉네임"
              isError={showNicknameError}
              message={
                showNicknameError
                  ? "닉네임은 2자 이상 12자 이하로 입력해 주세요."
                  : undefined
              }
              action={
                <button
                  type="button"
                  disabled={!isNicknameValid}
                  className={actionButtonClassName}
                >
                  중복 확인
                </button>
              }
            >
              <input
                id="nickname"
                type="text"
                autoComplete="nickname"
                placeholder="2~12자"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                aria-invalid={showNicknameError}
                aria-describedby={showNicknameError ? "nickname-message" : undefined}
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="password"
              label="비밀번호"
              isError={showPasswordError}
              // 비밀번호 조건은 항상 안내하고, 조건을 못 지키면 빨간색으로 바꿔요.
              message="영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
            >
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                aria-invalid={showPasswordError}
                aria-describedby="password-message"
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="passwordConfirm"
              label="비밀번호 확인"
              isError={showPasswordConfirmError}
              message={
                showPasswordConfirmError ? "비밀번호가 일치하지 않아요." : undefined
              }
            >
              <input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                placeholder="다시 입력"
                value={form.passwordConfirm}
                onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
                aria-invalid={showPasswordConfirmError}
                aria-describedby={
                  showPasswordConfirmError ? "passwordConfirm-message" : undefined
                }
                className={inputClassName}
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="mt-5 h-12 rounded-lg bg-accent text-[15px] font-semibold text-white transition-[filter,opacity] duration-200 ease-in-out hover:brightness-92 disabled:opacity-40 disabled:hover:brightness-100"
          >
            가입하기
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          이미 계정이 있나요?{" "}
          {/* 로그인 페이지는 필수 미션에서 만들고 연결해요. */}
          <Link to="/" className="font-semibold text-accent hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}

const inputClassName =
  "h-full w-full min-w-0 bg-transparent text-[15px] text-text outline-none placeholder:text-muted";

const actionButtonClassName =
  "shrink-0 px-1 text-[13px] font-semibold text-accent transition-opacity hover:opacity-70 disabled:text-muted disabled:hover:opacity-100";

interface FormFieldProps {
  id: string;
  label: string;
  isError?: boolean;
  message?: string;
  action?: ReactNode;
  children: ReactNode;
}

function FormField({ id, label, isError, message, action, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-lg border bg-white px-4 transition-colors",
          isError
            ? "border-red-500"
            : "border-border focus-within:border-accent",
        )}
      >
        {children}
        {action}
      </div>
      {message && (
        <p
          id={`${id}-message`}
          className={cn("text-xs", isError ? "text-red-500" : "text-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
