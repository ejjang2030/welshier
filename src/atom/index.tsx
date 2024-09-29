import {atom} from "recoil";
import {LanguageType} from "types/translations";

export const languageState = atom<LanguageType>({
  key: "language",
  default: (localStorage.getItem("language") || "ko") as LanguageType,
});
