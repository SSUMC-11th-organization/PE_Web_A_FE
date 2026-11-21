import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    // 7주차 try 안의 성공 처리를 옮겨요.
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
    // 7주차 catch 안의 실패 처리를 옮겨요.
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
