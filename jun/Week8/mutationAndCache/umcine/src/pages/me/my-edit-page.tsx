import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import type { MemberInfo } from "../../api/members/me";
import {
  FormField,
  formActionButtonClassName,
  formInputClassName,
} from "../../components/auth/form-field";
import { ProfileAvatar } from "../../components/me/profile-avatar";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { meQueryOptions } from "../../queries/me-query";

export function MyEditPage() {
  const meQuery = useQuery(meQueryOptions);

  if (meQuery.isPending) {
    return <EditStatus message="내 정보를 불러오는 중이에요." />;
  }

  if (meQuery.isError) {
    return <EditStatus message="내 정보를 불러오지 못했어요." />;
  }

  // 수정에 성공해 캐시의 닉네임이 바뀌면 폼을 새 값으로 다시 시작해요.
  return <MyEditForm key={meQuery.data.nickname} profile={meQuery.data} />;
}

function EditStatus({ message }: { message: string }) {
  return (
    <main className="flex flex-1 items-center justify-center p-10 text-sm text-muted">
      {message}
    </main>
  );
}

function MyEditForm({ profile }: { profile: MemberInfo }) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();

  const [nickname, setNickname] = useState(profile.nickname);
  const [nicknameCheck, setNicknameCheck] = useState({
    isChecking: false,
    isAvailable: false,
  });

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== profile.nickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꾸고 중복 확인까지 통과해야 저장할 수 있어요.
  const canSave = isNicknameChanged && isNicknameValid && nicknameCheck.isAvailable;

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

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      // 캐시는 훅의 onSuccess에서 바뀌므로, 이 화면에서는 이동만 해요.
      { onSuccess: () => navigate({ to: "/me" }) },
    );
  };

  return (
    <main className="flex flex-1 flex-col px-5 pt-6 pb-10 sm:px-12 sm:pt-10 sm:pb-16 xl:px-20">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.3px]">내 정보 수정</h1>
            <p className="mt-1 text-sm text-muted">닉네임만 변경할 수 있어요.</p>
          </div>
          <button
            type="submit"
            disabled={!canSave || updateMeMutation.isPending}
            className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-[filter,opacity] duration-200 ease-in-out hover:brightness-92 disabled:opacity-40 disabled:hover:brightness-100"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            {/* 내 정보 API에 프로필 이미지가 없어서 기본 이미지를 보여줘요. */}
            <ProfileAvatar imageUrl={null} className="size-20" />
            <p className="text-sm font-bold text-text">프로필 이미지</p>
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
                disabled={nicknameCheck.isChecking || updateMeMutation.isPending}
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
