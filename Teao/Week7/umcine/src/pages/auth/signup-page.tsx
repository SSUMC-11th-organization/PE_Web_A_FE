import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { AuthField } from "../../components/auth/auth-field";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const DEFAULT_DUPLICATE_CHECK = { isChecking: false, isAvailable: false };

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: FormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
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
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable: response.available },
      }));
      alert(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fb] px-4 py-20 text-slate-950">
      <form className="mx-auto w-full max-w-md space-y-5" onSubmit={handleSubmit} noValidate>
        <h1 className="mb-10 text-center text-3xl font-black">회원가입</h1>
        <AuthField
          label="이메일"
          type="email"
          value={form.email}
          placeholder="name@example.com"
          disabled={duplicateCheck.email.isChecking}
          error={form.email && !isEmailValid ? "올바른 이메일 형식을 입력해 주세요." : undefined}
          action={{
            label: duplicateCheck.email.isChecking ? "확인 중" : "중복 확인",
            disabled: !isEmailValid || duplicateCheck.email.isChecking,
            onClick: () => handleCheckDuplicate("email"),
          }}
          onChange={(value) => handleChangeField("email", value)}
        />
        <AuthField
          label="닉네임"
          value={form.nickname}
          placeholder="2~12자"
          disabled={duplicateCheck.nickname.isChecking}
          error={form.nickname && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : undefined}
          action={{
            label: duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인",
            disabled: !isNicknameValid || duplicateCheck.nickname.isChecking,
            onClick: () => handleCheckDuplicate("nickname"),
          }}
          onChange={(value) => handleChangeField("nickname", value)}
        />
        <AuthField
          label="비밀번호"
          type="password"
          value={form.password}
          placeholder="8자 이상"
          error={
            form.password && !isPasswordValid
              ? "영문 대소문자, 숫자, 특수문자를 포함해 주세요."
              : undefined
          }
          onChange={(value) => handleChangeField("password", value)}
        />
        <AuthField
          label="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          placeholder="다시 입력"
          error={
            form.passwordConfirm && !isPasswordConfirmValid
              ? "비밀번호가 일치하지 않아요."
              : undefined
          }
          onChange={(value) => handleChangeField("passwordConfirm", value)}
        />
        <button
          className="w-full rounded-md bg-umc py-3.5 font-bold text-white disabled:bg-slate-300"
          type="submit"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <p className="text-center text-sm text-slate-500">
          이미 계정이 있나요?{" "}
          <Link className="font-bold text-umc" to="/login">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
