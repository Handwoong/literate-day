import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { get } from "../../../utils/api";

function KakaoLoginHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const kakaoCode = new URL(document.location.toString()).searchParams.get(
    "code"
  );

  useEffect(() => {
    const getKakaoToken = async () => {
      try {
        const res = await get("oauth/kakao?code=" + kakaoCode);
        const jwtToken = res.data.access_token;
        sessionStorage.setItem("userToken", jwtToken);

        queryClient.invalidateQueries("userState");
        navigate("/");
      } catch (err) {
        console.log("카카오 로그인에 실패하였습니다.", err);
        navigate("/user/login");
      }
    };

    getKakaoToken();
  }, [kakaoCode, navigate, queryClient]);

  return null;
}

export default KakaoLoginHandler;
