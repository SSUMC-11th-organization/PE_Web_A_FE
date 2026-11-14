import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import {
  FormField,
  formActionButtonClassName,
  formInputClassName,
} from "../../components/auth/form-field";
import { ProfileAvatar } from "../../components/me/profile-avatar";
import { useMeStore } from "../../stores/me-store";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function MyEditPage() {
  const navigate = useNavigate();
  const profile = useMeStore((state) => state.profile);
  const updateProfile = useMeStore((state) => state.updateProfile);

  const [nickname, setNickname] = useState(profile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImageUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [nicknameCheck, setNicknameCheck] = useState({
    isChecking: false,
    isAvailable: false,
  });

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== profile.nickname;
  const isImageChanged = profileImageUrl !== profile.profileImageUrl;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨다면 중복 확인까지 통과해야 저장할 수 있어요.
  const canSave =
    (isNicknameChanged || isImageChanged) &&
    isNicknameValid &&
    (!isNicknameChanged || nicknameCheck.isAvailable);

  const handleChangeNickname = (value: string) => {
    if (nicknameCheck.isChecking) return;
    setNicknameCheck({ isChecking: false, isAvailable: false });
    setNickname(value);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking) return;

    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: available });
      alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 값을 비워요.
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }

    // 미리보기용으로 파일을 data URL로 읽어요. 실제 업로드는 8주차에 연결해요.
    const reader = new FileReader();
    reader.onload = () => {
      setImageError(null);
      setProfileImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    // 8주차에서 내 정보 수정 API 요청으로 바꿔요.
    updateProfile({ nickname: trimmedNickname, profileImageUrl });
    navigate({ to: "/me" });
  };

  return (
    <main className="flex flex-1 flex-col px-5 pt-6 pb-10 sm:px-12 sm:pt-10 sm:pb-16 xl:px-20">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.3px]">내 정보 수정</h1>
            <p className="mt-1 text-sm text-muted">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-[filter,opacity] duration-200 ease-in-out hover:brightness-92 disabled:opacity-40 disabled:hover:brightness-100"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <label className="relative cursor-pointer" aria-label="프로필 이미지 변경">
              <ProfileAvatar imageUrl={profileImageUrl} className="size-20" />
              <span className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full bg-white">
                <img src="/icons/edit.svg" alt="" className="size-6" />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                className="sr-only"
              />
            </label>
            <p className="text-sm font-bold text-text">프로필 이미지</p>
            <p className="text-xs text-muted">선택 사항 · 최대 5MB</p>
            {imageError && <p className="text-xs text-red-500">{imageError}</p>}
          </div>

          <div className="flex flex-col gap-4">
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
                  disabled={
                    !isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking
                  }
                  onClick={handleCheckNickname}
                  className={formActionButtonClassName}
                >
                  {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
                </button>
              }
            >
              <input
                id="nickname"
                type="text"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => handleChangeNickname(e.target.value)}
                disabled={nicknameCheck.isChecking}
                aria-invalid={showNicknameError}
                aria-describedby={showNicknameError ? "nickname-message" : undefined}
                className={formInputClassName}
              />
            </FormField>

            <FormField id="email" label="이메일">
              {/* 이메일은 변경할 수 없어요. */}
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className={formInputClassName}
              />
            </FormField>
          </div>
        </div>

        <section className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-400 bg-red-50 px-5 py-4 max-md:mt-12">
          <div>
            <h2 className="text-sm font-bold text-red-600">회원 탈퇴</h2>
            <p className="mt-1 text-xs text-red-500">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          {/* 회원 탈퇴 API는 아직 연결하지 않았어요. */}
          <button
            type="button"
            className="rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            회원 탈퇴
          </button>
        </section>
      </form>
    </main>
  );
}
