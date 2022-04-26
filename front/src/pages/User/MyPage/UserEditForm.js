import {
  EditContainer,
  EditBox,
  EditIntroduceBox,
  EditInput,
  EditIntroduceInput,
  ConfirmButton,
  ConfirmButtonBox,
} from "../../../styles/User/MyPageStyle";

function UserEditForm({ editStateStore }) {
  const { setIsEdit } = editStateStore;

  return (
    <EditContainer>
      <EditBox>
        <EditInput placeholder="Nickname*" />
        <EditInput placeholder="Password*" />
        <EditInput placeholder="Confirm Password*" />
        <ConfirmButtonBox>
          <ConfirmButton>확인</ConfirmButton>
          <ConfirmButton onClick={() => setIsEdit((cur) => !cur)}>
            취소
          </ConfirmButton>
        </ConfirmButtonBox>
      </EditBox>
      <EditIntroduceBox>
        <EditIntroduceInput placeholder="Introduce" />
      </EditIntroduceBox>
    </EditContainer>
  );
}

export default UserEditForm;
