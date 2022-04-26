import { render, screen } from "../../../../test-utils";
import UserEditForm from "../../../../pages/User/MyPage/UserEditForm";

describe("UserEditForm 요소 테스트", () => {
  it("닉네임 수정 inputBox", () => {
    render(<UserEditForm />);
    const editProfileNickname = screen.queryByPlaceholderText(/nickname/i);
    expect(editProfileNickname).toBeInTheDocument();
  });

  it("비밀번호 변경 inputBox", () => {
    render(<UserEditForm />);
    const editProfilePassword = screen.queryByPlaceholderText("Password");
    expect(editProfilePassword).toBeInTheDocument();
  });

  it("비밀번호 확인 inputBox", () => {
    render(<UserEditForm />);
    const editProfileConfirmPassword =
      screen.queryByPlaceholderText("Confirm Password");
    expect(editProfileConfirmPassword).toBeInTheDocument();
  });

  it("소개 textarea", () => {
    render(<UserEditForm />);
    const editProfileIntroduce = screen.queryByPlaceholderText(/introduce/i);
    expect(editProfileIntroduce).toBeInTheDocument();
  });

  it("확인 버튼", () => {
    render(<UserEditForm />);
    const confirmButton = screen.getByRole("button", {
      name: "확인",
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("취소 버튼", () => {
    render(<UserEditForm />);
    const cancleButton = screen.getByRole("button", {
      name: "취소",
    });
    expect(cancleButton).toBeInTheDocument();
  });
});
