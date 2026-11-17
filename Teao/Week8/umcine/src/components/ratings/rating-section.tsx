import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, getMemberRatings, removeRating, updateRating } from "../../api/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromAccessToken } from "../../utils/auth";

interface RatingSectionProps {
  movieId: number;
}

export function RatingSection({ movieId }: RatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromAccessToken(accessToken);
  const queryClient = useQueryClient();
  const [changedScore, setChangedScore] = useState<number | null>(null);
  const [changedComment, setChangedComment] = useState<string | null>(null);
  const ratingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });
  const rating = useMemo(
    () => ratingsQuery.data?.find((item) => item.movieId === movieId),
    [movieId, ratingsQuery.data],
  );
  const score = changedScore ?? rating?.score ?? 5;
  const comment = changedComment ?? rating?.comment ?? "";
  const refreshRatings = () =>
    queryClient.invalidateQueries({ queryKey: ["members", memberId, "ratings"] });
  const saveMutation = useMutation({
    mutationFn: () =>
      rating
        ? updateRating(rating.ratingId, { score, comment: comment.trim() })
        : createRating(movieId, { score, comment: comment.trim() }),
    onSuccess: refreshRatings,
    onError: () => alert("평점을 저장하지 못했어요."),
  });
  const deleteMutation = useMutation({
    mutationFn: () => removeRating(rating!.ratingId),
    onSuccess: () => {
      setChangedScore(5);
      setChangedComment("");
      refreshRatings();
    },
    onError: () => alert("평점을 삭제하지 못했어요."),
  });

  if (!accessToken) {
    return <p className="mt-8 text-sm text-white/55">로그인하면 평점을 남길 수 있어요.</p>;
  }

  if (memberId === null) {
    return <p className="mt-8 text-sm text-white/55">회원 정보를 확인할 수 없어요.</p>;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!saveMutation.isPending) saveMutation.mutate();
  };

  return (
    <form className="mt-8 max-w-xl rounded-2xl border border-white/15 bg-black/45 p-5" onSubmit={handleSubmit}>
      <h2 className="font-black">내 평점</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          className="rounded-md bg-white px-3 py-2 font-bold text-slate-950"
          aria-label="평점"
          value={score}
          onChange={(event) => setChangedScore(Number(event.target.value))}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value}점
            </option>
          ))}
        </select>
        <input
          className="min-w-0 flex-1 rounded-md bg-white px-3 py-2 text-slate-950"
          value={comment}
          placeholder="한줄평을 입력해 주세요."
          onChange={(event) => setChangedComment(event.target.value)}
        />
        <button className="rounded-md bg-umc px-5 py-2 font-bold disabled:opacity-50" disabled={saveMutation.isPending}>
          {rating ? "수정" : "등록"}
        </button>
        {rating && (
          <button
            className="rounded-md border border-white/20 px-5 py-2 font-bold disabled:opacity-50"
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}
