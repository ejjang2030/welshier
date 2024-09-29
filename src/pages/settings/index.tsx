import {languageState} from "atom";
import {getAuth, signOut} from "firebase/auth";
import {app} from "firebaseApp";
import {initializeI18n} from "i18n";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {changeDayJsLang} from "utils/TimeUtils";

const SettingsPage = () => {
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
    <>
      <button
        type='button'
        onClick={handleLogout}>
        로그아웃
      </button>
      <button
        type='button'
        onClick={handleChangeLanguage}>
        한영변환
      </button>
    </>
  );
};

export default SettingsPage;
