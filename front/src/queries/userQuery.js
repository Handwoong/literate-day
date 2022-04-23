import { useMutation, useQuery, useQueryClient } from "react-query";
import { get, post } from "../utils/api";
import { useNavigate } from "react-router-dom";

/**
 * 현재 유저상태를 받아오며, token이 없어 error가 발생하면 userState는 false를 return합니다.
 * @returns {(object|boolean|boolean|string)} {userState, isLoading, isLogin, error}
 **/
export function useCurrentUser() {
  const { isLoading, error, data } = useQuery(
    "userState",
    () => get("user/current").then((res) => res.data),
    {
      initialData: false,
      staleTime: Infinity,
      onSuccess: () => console.log("로그인 성공!"),
      onError: () => console.log("로그인 실패"),
    }
  );

  return { userState: data, isLoading, isLogin: !!data, error };
}

/**
 * 유저 로그인 핸들러입니다.
 * @returns {function} useMutation훅을 리턴합니다.
 **/
export const useUserLogin = (setShowAlert = () => {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(async (loginData) => await post("user/login", loginData), {
    onSuccess: (res) => {
      const jwtToken = res.data.token;
      sessionStorage.setItem("userToken", jwtToken);
      queryClient.invalidateQueries("userState");
      navigate("/");
    },
    onError: () => setShowAlert(true),
  });
};
