import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import {
  FormField,
  formActionButtonClassName,
  formInputClassName,
  formSubmitButtonClassName,
} from "../../components/auth/form-field";

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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

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

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않아요.
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={!isEmailValid || duplicateCheck.email.isChecking}
                  onClick={() => handleCheckDuplicate("email")}
                  className={formActionButtonClassName}
                >
                  {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
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
                disabled={duplicateCheck.email.isChecking}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-message" : undefined}
                className={formInputClassName}
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
                  disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                  onClick={() => handleCheckDuplicate("nickname")}
                  className={formActionButtonClassName}
                >
                  {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
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
                disabled={duplicateCheck.nickname.isChecking}
                aria-invalid={showNicknameError}
                aria-describedby={showNicknameError ? "nickname-message" : undefined}
                className={formInputClassName}
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
                className={formInputClassName}
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
                className={formInputClassName}
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`mt-5 ${formSubmitButtonClassName}`}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
