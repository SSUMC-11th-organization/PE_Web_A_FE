import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../api/get-api-error-message";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";
import { meQueryKey } from "../queries/me-query";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 담겨 있으므로 다시 조회하지 않고 캐시를 직접 바꿔요.
      queryClient.setQueryData<MemberInfo>(meQueryKey, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: (error) => {
      alert(
        getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."),
      );
    },
  });
}
