import {ChangeEvent, useState} from "react";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {app} from "firebaseApp";
import {toast} from "react-toastify";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;
    setEmail(value);
  };

  const handleOnClickBtn = async () => {
    await sendPasswordResetEmail(getAuth(app), email);
    toast.info("비밀번호 재설정 메일을 전송했습니다.");
  };
  return (
    <>
      <input
        type='email'
        onChange={handleChangeInput}
        value={email}
        placeholder='이메일을 입력해주세요.'
      />
      <button
        type='button'
        onClick={handleOnClickBtn}>
        확인
      </button>
    </>
  );
};

export default ResetPasswordPage;
