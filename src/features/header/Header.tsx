import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const Header: React.FC<{
  onLogout: () => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
  username?: string;
}> = ({ onLogout, currentLang, onLangChange, username }) => {
  const { t } = useTranslation();
  return (
    <header
      style={{
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 32px",
        position: "fixed",
        left: 220,
        right: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ marginRight: "auto", fontWeight: 700, fontSize: 20 }}>
        {t("Loyalty Admin Portal")}
      </div>
      <div style={{ marginRight: 24 }}>
        <select
          value={currentLang}
          onChange={(e) => {
            i18n.changeLanguage(e.target.value);
            localStorage.setItem("i18nextLng", e.target.value);
            onLangChange(e.target.value);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            marginRight: 16,
            fontWeight: 500,
          }}
        >
          <option value="en">{t("English")}</option>
          <option value="sr">{t("Serbian")}</option>
        </select>
      </div>
      {username && (
        <span style={{ marginRight: 24, color: "#23272f", fontWeight: 500 }}>
          {username}
        </span>
      )}
      <button
        type="button"
        onClick={onLogout}
        style={{
          background: "#23272f",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "8px 18px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {t("Logout")}
      </button>
    </header>
  );
};

export default Header;
