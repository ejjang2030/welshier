import {ChangeEvent, useState} from "react";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {app} from "firebaseApp";
import {toast} from "react-toastify";
import { GiSittingDog } from "react-icons/gi";
import {Link} from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;
    setEmail(value);
    if (!value) {
      setErrorMsg("");
      return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!value?.match(emailRegex)) {
      setErrorMsg("이메일 형식이 올바르지 않습니다.");
      return;
    } else {
      setErrorMsg("");
    }
  };

  const handleOnClickBtn = async () => {
    await sendPasswordResetEmail(getAuth(app), email);
    toast.info("비밀번호 재설정 메일을 전송했습니다.");
  };
  return (
    <div className='reset-password'>
      <div className='reset-password__title'>
        <GiSittingDog className='reset-password__title-image' />
        <span>비밀번호 재설정</span>
      </div>
      <div className='reset-password__form'>
        <div className='reset-password__form-input'>
          <div className='reset-password__form-flex-row'>
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
          </div>
          {!!errorMsg && (
            <div className='reset-password__form-input-error'>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
        <div className='reset-password__form-login'>
          <Link to='/users/login'>뒤로가기</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
