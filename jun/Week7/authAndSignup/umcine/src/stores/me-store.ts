import { create } from "zustand";

// 내 정보 조회·수정 API는 8주차에 연결해요.
// 그전까지는 화면에서 입력한 값이 반영되는지 확인할 수 있도록 임시 데이터를 사용해요.
export interface MyProfile {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}

interface MeStore {
  profile: MyProfile;
  updateProfile: (
    profile: Partial<Pick<MyProfile, "nickname" | "profileImageUrl">>,
  ) => void;
}

export const useMeStore = create<MeStore>()((set) => ({
  profile: {
    nickname: "jun",
    email: "jun@example.com",
    profileImageUrl: null,
  },
  updateProfile: (profile) =>
    set((state) => ({ profile: { ...state.profile, ...profile } })),
}));
