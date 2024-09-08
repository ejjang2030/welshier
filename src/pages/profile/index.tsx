import {getAuth, signOut} from "firebase/auth";
import {app} from "firebaseApp";

const ProfilePage = () => {
  const handleLogout = async () => {
    await signOut(getAuth(app));
  };

  return (
    <div>
      <button
        type='button'
        onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default ProfilePage;
