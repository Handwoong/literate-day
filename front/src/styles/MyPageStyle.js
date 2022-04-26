import styled from "styled-components";
import { SubmitButton } from "./AuthStyle";

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 30px auto;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  padding-bottom: 15px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
`;

export const CardBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 100%;
`;

export const CardContent = styled.div`
  width: 70%;
  height: 100%;
`;

export const CardIntroduce = styled.div`
  word-break: break-all;
  width: 100%;
  height: 50%;
`;

export const CardMyInfo = styled.div`
  display: flex;
  flex-direction: row;
  word-break: break-all;
  width: 100%;
  height: calc(50% - 20px);
`;

export const CardLikePost = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 100%;
`;

export const CardLikeCountBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
`;

export const ProfileHeading = styled.h2`
  color: #c48f5a;
`;

export const ProfileNickName = styled(ProfileHeading)`
  color: black;
  margin-top: 20px;
  font-size: 2rem;
`;

export const ProfileIntroduce = styled.p`
  font-size: 1.4rem;
`;

export const ProfileImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80%;
`;

export const ProfileImg = styled.img`
  width: 80%;
  height: 100%;
  border-radius: 75%;
  box-shadow: 5px 5px 10px grey;
`;

export const ProfileChangeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20%;
`;

export const ChangeButton = styled(SubmitButton)`
  margin: 10px auto;
`;
