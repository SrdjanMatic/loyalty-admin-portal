import { useTranslation } from "react-i18next";
import { MRT_Localization_SR_LATN_RS } from "material-react-table/locales/sr-Latn-RS";
// import other locales as needed

export function useTableLocalization() {
  const { i18n } = useTranslation();
  switch (i18n.language) {
    case "sr":
      return MRT_Localization_SR_LATN_RS;
    // Add more cases for other languages if needed
    default:
      return undefined; // default (English)
  }
}
