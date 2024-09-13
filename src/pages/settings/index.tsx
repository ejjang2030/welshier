import {getAuth, signOut} from "firebase/auth";
import {app} from "firebaseApp";

const SettingsPage = () => {
  const handleLogout = async () => {
    await signOut(getAuth(app));
  };
  return (
    <>
      <button
        type='button'
        onClick={handleLogout}>
        로그아웃
      </button>
    </>
  );
};

export default SettingsPage;
