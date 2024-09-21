import React, {useState, ChangeEvent} from "react";
import LoginForm from "components/users/LoginForm";
import {GiSittingDog} from "react-icons/gi";
import {RiKakaoTalkFill} from "react-icons/ri";
import {SiNaver} from "react-icons/si";
import {
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {toast} from "react-toastify";
import {app} from "firebaseApp";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(getAuth(app), email, password);
      navigate("/");
      toast.success("로그인이 되었습니다.");
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleLoginKakao = async (e: any) => {
    e.preventDefault();
    try {
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const handleLoginNaver = async (e: any) => {
    e.preventDefault();
    try {
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div className='login'>
      <div className='login__title'>
        <GiSittingDog className='login__title-image' />
        <span>로그인</span>
      </div>
      <LoginForm
        errorMsg={errorMsg}
        handleChangeInput={handleChangeInput}
        handleSubmitLogin={handleSubmitLogin}
      />
      {/* <div className='login__oauth'>
        <div
          className='login__oauth-kakao'
          onClick={handleLoginKakao}>
          <RiKakaoTalkFill className='login__oauth-kakao-icon' /> 카카오로
          로그인
        </div>
        <div
          className='login__oauth-naver'
          onClick={handleLoginNaver}>
          <SiNaver
            className='login__oauth-naver-icon'
            style={{color: "white !important"}}
          />{" "}
          네이버로 로그인
        </div>
      </div> */}
    </div>
  );
};

export default LoginPage;
