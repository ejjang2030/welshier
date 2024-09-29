// src/i18n.js
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {doc, getDoc} from "firebase/firestore";
import {db} from "firebaseApp";

const loadTranslations = async (lng: string) => {
  const cachedTranslations = localStorage.getItem(`translations_${lng}`);
  if (cachedTranslations) {
    return JSON.parse(cachedTranslations);
  }

  const docRef = doc(db, "translations", lng);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    localStorage.setItem(`translations_${lng}`, JSON.stringify(data));
    return data;
  } else {
    console.warn(`No translation found for language: ${lng}`);
    return null;
  }
};

export const initializeI18n = async (changeLang?: string) => {
  const defaultLanguage = "en"; // 기본 언어 설정
  const resources = {} as any;

  // 기본 언어 로드
  const defaultTranslations = await loadTranslations(
    changeLang ?? defaultLanguage
  );
  if (defaultTranslations) {
    resources[defaultLanguage] = {
      translation: defaultTranslations,
    };
  }

  // 초기화
  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React는 XSS 보호를 기본 제공
    },
  });
};

export default i18n;
