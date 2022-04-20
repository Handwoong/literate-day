import { useState } from "react";
import { validation } from "../../../utils/validation";

function Register() {
  const initialInfo = {
    email: "",
    password: "",
    confirmPassword: "",
    nickName: "",
  };
  const [registerInfo, setRegisterInfo] = useState(initialInfo);
  const isActive = validation("register", registerInfo);

  const handleOnChange = (e) => {
    setRegisterInfo((cur) => ({ ...cur, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2>문해한 하루</h2>
      <form>
        <label htmlFor="register-email">이메일</label>
        <input
          id="register-email"
          type="email"
          name="email"
          onChange={handleOnChange}
        />
        <label htmlFor="register-password">비밀번호</label>
        <input
          id="register-password"
          type="password"
          name="password"
          onChange={handleOnChange}
        />
        <label htmlFor="register-confirm-password">비밀번호 확인</label>
        <input
          id="register-confirm-password"
          type="password"
          name="confirmPassword"
          onChange={handleOnChange}
        />
        <label htmlFor="register-nickname">닉네임</label>
        <input
          id="register-nickname"
          type="text"
          name="nickName"
          onChange={handleOnChange}
        />
        <button type="submit" disabled={!isActive}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Register;
