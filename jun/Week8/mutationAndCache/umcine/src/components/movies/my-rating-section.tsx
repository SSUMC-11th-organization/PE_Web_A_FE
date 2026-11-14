import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode, type SubmitEvent } from "react";
import type { Rating } from "../../api/ratings/models";
import { useMyMemberId } from "../../hooks/use-my-member-id";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { memberRatingsQueryOptions } from "../../queries/rating-queries";
import { cn } from "../../utils/cn";

const SCORES = [1, 2, 3, 4, 5];
const MAX_COMMENT_LENGTH = 500;

interface MyRatingSectionProps {
  movieId: number;
}

export function MyRatingSection({ movieId }: MyRatingSectionProps) {
  const memberId = useMyMemberId();

  if (memberId === null) {
    return (
      <SectionLayout>
        <p className="text-sm text-muted">로그인하면 평점을 남길 수 있어요.</p>
        <Link to="/login" className="text-sm font-semibold text-accent hover:underline">
          로그인하기
        </Link>
      </SectionLayout>
    );
  }

  return <MyRatingLoader memberId={memberId} movieId={movieId} />;
}

function MyRatingLoader({ memberId, movieId }: { memberId: number; movieId: number }) {
  // 내가 남긴 평점 목록에서 이 영화의 평점을 찾아요.
  const ratingsQuery = useQuery(memberRatingsQueryOptions(memberId));

  if (ratingsQuery.isPending) {
    return (
      <SectionLayout>
        <p className="text-sm text-muted">내 평점을 불러오는 중이에요.</p>
      </SectionLayout>
    );
  }

  if (ratingsQuery.isError) {
    return (
      <SectionLayout>
        <p className="text-sm text-red-500">내 평점을 불러오지 못했어요.</p>
      </SectionLayout>
    );
  }

  const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId);

  // 등록·삭제로 평점이 생기거나 사라지면 폼을 서버 값으로 다시 시작해요.
  return (
    <RatingForm
      key={myRating?.ratingId ?? "new"}
      memberId={memberId}
      movieId={movieId}
      rating={myRating}
    />
  );
}

interface RatingFormProps {
  memberId: number;
  movieId: number;
  rating: Rating | undefined;
}

function RatingForm({ memberId, movieId, rating }: RatingFormProps) {
  const createMutation = useCreateRatingMutation(memberId);
  const updateMutation = useUpdateRatingMutation(memberId);
  const deleteMutation = useDeleteRatingMutation(memberId);

  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const trimmedComment = comment.trim();
  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const isChanged =
    !rating || score !== rating.score || trimmedComment !== (rating.comment ?? "");
  const canSubmit = score > 0 && isChanged && !isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    // 후기는 선택이라 비어 있으면 null로 보내요.
    const body = { score, comment: trimmedComment || null };

    if (rating) {
      updateMutation.mutate({ ratingId: rating.ratingId, ...body });
    } else {
      createMutation.mutate({ movieId, ...body });
    }
  }

  function handleDelete() {
    if (!rating || isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;

    deleteMutation.mutate(rating.ratingId);
  }

  return (
    <SectionLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2" role="radiogroup" aria-label="별점">
          {SCORES.map((value) => {
            const isFilled = value <= score;

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={value === score}
                aria-label={`${value}점`}
                disabled={isPending}
                onClick={() => setScore(value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md border transition-colors duration-150",
                  isFilled
                    ? "border-accent bg-accent"
                    : "border-border bg-white hover:bg-surface-hover",
                )}
              >
                <img
                  src={isFilled ? "/icons/star.svg" : "/icons/star-outline.svg"}
                  alt=""
                  className={cn("size-4", isFilled ? "invert" : "opacity-60")}
                />
              </button>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          disabled={isPending}
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          aria-label="후기"
          className="h-[104px] resize-none rounded-lg border border-border bg-white p-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
        <p className="-mt-2 text-right text-xs text-muted">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 rounded-lg bg-text py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "저장 중"
              : rating
                ? "평점 수정"
                : "평점 저장"}
          </button>
          {rating && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg border border-red-400 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
            >
              {deleteMutation.isPending ? "삭제 중" : "삭제"}
            </button>
          )}
        </div>
      </form>
    </SectionLayout>
  );
}

function SectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-bold">내 평점</h2>
        <p className="text-xs text-muted">별점은 필수, 후기는 선택이에요.</p>
      </div>
      {children}
    </div>
  );
}
