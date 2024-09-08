import {ChangeEvent} from "react";
import {Link} from "react-router-dom";

interface SignupFormProps {
  errorMsg: string;
  handleSubmitSignup: (e: any) => {};
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SignupForm = (props: SignupFormProps) => {
  const {errorMsg, handleSubmitSignup, handleChangeInput} = props;
  return (
    <form
      className='signup__form'
      onSubmit={handleSubmitSignup}>
      <div className='signup__form-input'>
        <input
          className='signup__form-input-email'
          placeholder='이메일'
          type='email'
          name='email'
          onChange={handleChangeInput}
          required
        />
        <input
          className='signup__form-input-password'
          type='password'
          name='password'
          placeholder='비밀번호'
          onChange={handleChangeInput}
          required
        />
        <input
          className='signup__form-input-password-confirm'
          type='password'
          name='password-confirm'
          placeholder='비밀번호 확인'
          onChange={handleChangeInput}
          required
        />
        {!!errorMsg && (
          <div className='signup__form-input-error'>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
      <button type='submit'>회원가입</button>
      <div className='signup__form-login'>
        <span>계정이 있으신가요?</span>
        <Link to='/users/login'>로그인</Link>
      </div>
    </form>
  );
};

export default SignupForm;
