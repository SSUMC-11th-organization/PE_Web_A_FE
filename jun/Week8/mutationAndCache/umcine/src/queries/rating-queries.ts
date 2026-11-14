import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";

export const ratingKeys = {
  byMember: (memberId: number) => ["members", memberId, "ratings"] as const,
};

export function memberRatingsQueryOptions(memberId: number) {
  return queryOptions({
    queryKey: ratingKeys.byMember(memberId),
    queryFn: () => getMemberRatings(memberId),
  });
}
