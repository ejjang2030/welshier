import React, {useState, useEffect, ChangeEvent} from "react";
import {useNavigate} from "react-router-dom";
import {RiThreadsLine} from "react-icons/ri";
import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
  signOut,
} from "firebase/auth";
import {app} from "firebaseApp";
import SignupForm from "components/users/SignupForm";
import {toast} from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
  };

  useEffect(() => {
    clearInputs();
    setErrorMsg("");
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;
    switch (name) {
      case "email":
        setEmail(value);
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!value) {
          setErrorMsg("");
          return;
        }
        if (!value?.match(emailRegex)) {
          setErrorMsg("이메일 형식이 올바르지 않습니다.");
        } else {
          setErrorMsg("");
        }
        break;
      case "password":
        setPassword(value);
        if (value?.length < 8) {
          setErrorMsg("비밀번호는 8자 이상이여야합니다.");
        } else {
          setErrorMsg("");
        }
        break;
      case "password-confirm":
        setPasswordConfirm(value);
        if (value?.length < 8) {
          setErrorMsg("비밀번호는 8자 이상이여야합니다.");
        } else if (value !== password) {
          setErrorMsg("비밀번호 확인이 비밀번호와 서로 일치하지 않습니다.");
        } else {
          setErrorMsg("");
        }
        break;
      default:
        break;
    }
  };

  const handleSubmitSignup = async (e: any) => {
    e.preventDefault();
    try {
      createUserWithEmailAndPassword(getAuth(app), email, password)
        .then(userCredential => {
          signOut(getAuth(app)).then(() => {
            navigate("/users/profile/set", {
              state: {email, password, uid: userCredential.user.uid},
            });
          });
        })
        .catch(err => {
          toast.error("로그인에 실패했습니다.");
          navigate("/users/login");
        });
      // toast.success("회원가입이 완료되었습니다.");
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        toast.error("이메일이 올바르지 않거나, 존재하는 이메일입니다.");
      }
    }
  };

  return (
    <div className='signup'>
      <div className='signup__title'>
        <RiThreadsLine className='signup__title-image' />
        <span>회원가입</span>
      </div>
      <SignupForm
        errorMsg={errorMsg}
        handleChangeInput={handleChangeInput}
        handleSubmitSignup={handleSubmitSignup}
      />
    </div>
  );
};
export default SignupPage;
