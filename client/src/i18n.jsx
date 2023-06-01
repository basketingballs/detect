import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const Languages = ["en", "fr"];

i18n

  .use(Backend)
  .use(LanguageDetector)
  .use(XHR)
  .use(initReactI18next)

  .init({
    fallbackLng: "en",
    debug: true,
    whitelist: Languages,
  });

export default i18n;
