import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../api/get-api-error-message";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import type { Rating } from "../api/ratings/models";
import { updateRating } from "../api/ratings/update-rating";
import { ratingKeys } from "../queries/rating-queries";

// 평점 등록·수정·삭제는 모두 내 평점 목록 캐시를 직접 바꿔서 다시 조회하지 않아요.
// 서버 응답에 바뀐 평점이 그대로 담겨 오기 때문이에요.

export function useCreateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingKeys.byMember(memberId);

  return useMutation({
    mutationFn: createRating,
    onSuccess: (rating) => {
      // 목록은 최신순이므로 새 평점을 맨 앞에 넣어요.
      queryClient.setQueryData<Rating[]>(queryKey, (prev) =>
        prev ? [rating, ...prev] : prev,
      );
      alert("평점을 저장했어요.");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점을 저장하지 못했어요. 다시 시도해 주세요."));
      // 다른 탭에서 이미 등록한 경우(409)처럼 캐시가 서버와 다를 수 있어 다시 조회해요.
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingKeys.byMember(memberId);

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (rating) => {
      queryClient.setQueryData<Rating[]>(queryKey, (prev) =>
        prev?.map((item) => (item.ratingId === rating.ratingId ? rating : item)),
      );
      alert("평점을 수정했어요.");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점을 수정하지 못했어요. 다시 시도해 주세요."));
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingKeys.byMember(memberId);

  return useMutation({
    mutationFn: deleteRating,
    // 삭제 응답의 result는 null이라, 요청에 보낸 ratingId로 캐시에서 빼요.
    onSuccess: (_, ratingId) => {
      queryClient.setQueryData<Rating[]>(queryKey, (prev) =>
        prev?.filter((item) => item.ratingId !== ratingId),
      );
      alert("평점을 삭제했어요.");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점을 삭제하지 못했어요. 다시 시도해 주세요."));
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
