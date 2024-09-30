import {languageState} from "atom";
import {getAuth, signOut} from "firebase/auth";
import {app} from "firebaseApp";
import {AiOutlineArrowLeft as GoBackIcon} from "react-icons/ai";
import {FaLanguage as ChangeLanguageIcon} from "react-icons/fa6";
import {initializeI18n} from "i18n";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {changeDayJsLang} from "utils/TimeUtils";
import {useNavigate} from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const {t, i18n} = useTranslation();
  const [currLang, setCurrLang] = useRecoilState(languageState);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    initializeI18n(lng);
  };

  const handleChangeLanguage = () => {
    const newLang = currLang === "ko" ? "en" : "ko";
    changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setCurrLang(newLang);
    changeDayJsLang(newLang);
  };

  const handleLogout = async () => {
    await signOut(getAuth(app));
  };

  return (
    <div>
      <div className='post-new__appbar'>
        <div className='post-new__appbar-box-left'>
          <GoBackIcon
            className='post-new__appbar-left'
            onClick={() => navigate(-1)}
          />
          <span>설정</span>
        </div>
      </div>
      <div className='settings__body'>
        <div
          className='settings__body-item'
          onClick={handleChangeLanguage}>
          <ChangeLanguageIcon className='icon' />
          <span>언어 :</span>
          <span>{currLang === "ko" ? "한국어" : "English"}</span>
        </div>
        <div
          className='settings__body-item logout'
          onClick={handleLogout}>
          로그아웃
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
