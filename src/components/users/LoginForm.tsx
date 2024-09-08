import {ChangeEvent} from "react";
import {Link} from "react-router-dom";

interface LoginFormProps {
  errorMsg: string;
  handleSubmitLogin: (e: any) => void;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm = (props: LoginFormProps) => {
  const {errorMsg, handleSubmitLogin, handleChangeInput} = props;
  return (
    <form
      className='login__form'
      onSubmit={handleSubmitLogin}>
      <div className='login__form-input'>
        <input
          className='login__form-input-email'
          placeholder='이메일'
          type='email'
          name='email'
          onChange={handleChangeInput}
          required
        />
        <input
          className='login__form-input-password'
          type='password'
          name='password'
          placeholder='비밀번호'
          onChange={handleChangeInput}
          required
        />
        {!!errorMsg && (
          <div className='login__form-input-error'>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
      <button type='submit'>로그인</button>
      <div className='login__form-signup'>
        <span>계정이 없으신가요?</span>
        <Link to='/users/signup'>회원가입</Link>
      </div>
      <div className='login__form-signup'>
        <span>비밀번호를 잊어버렸나요?</span>
        <Link to='/users/reset-password'>비밀번호 재설정</Link>
      </div>
    </form>
  );
};

export default LoginForm;
