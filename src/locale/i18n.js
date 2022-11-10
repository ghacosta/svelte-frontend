// @ts-nocheck
import { addMessages, init, getLocaleFromNavigator, locale } from "svelte-i18n";
import en from "./en.json";
import es from "./es.json";

addMessages("en", en);
addMessages("es", es);

init({ 
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator()
});

export const reset = () => {
  locale.set("en");
}