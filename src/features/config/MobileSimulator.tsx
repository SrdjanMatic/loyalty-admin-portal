import React from "react";
import { FaCoins } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface MobileSimulatorProps {
  config: {
    fontColor: string;
    backgroundColor: string;
    headerAndButtonColor: string;
    restaurantDisplayName: string;
    description: string;
    logo: string | null;
    backgroundImage: string | null;
    challengeList: { period: number; visitsRequired: number }[];
  };
}

const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  config: {
    fontColor,
    backgroundColor,
    headerAndButtonColor,
    restaurantDisplayName,
    description,
    logo,
    backgroundImage,
  },
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        width: 270,
        height: 555,
        border: "12px solid #222",
        borderRadius: 32,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        background: "#111",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 246,
          height: 531,
          background: backgroundColor,
          borderRadius: 20,
          overflow: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          fontFamily: "'Montserrat', Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Background image with low opacity */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.23,
            zIndex: 0,
            borderRadius: 20,
            pointerEvents: "none",
          }}
        />
        {/* Simulated mobile header */}
        <div
          style={{
            background: headerAndButtonColor,
            padding: "22px 0 0 0",
            borderBottom: `2px solid ${fontColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "left",
            height: 50,
            position: "relative",
            zIndex: 1,
          }}
        >
          {logo && (
            <div
              style={{
                marginLeft: 2,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={logo}
                alt={t("Logo")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#eee",
                  padding: 2,
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div style={{ flex: 4, textAlign: "center" }}>
            <h1
              style={{
                color: fontColor,
                fontWeight: 700,
                fontSize: 12,
                margin: 0,
                letterSpacing: 1,
              }}
            >
              {restaurantDisplayName}
            </h1>
            <div
              style={{
                color: fontColor,
                fontWeight: 500,
                fontSize: 14,
                marginTop: 2,
                letterSpacing: 1,
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaCoins style={{ color: fontColor, fontSize: 12 }} />
            <span style={{ fontWeight: 400, color: fontColor }}>{123}</span>
          </div>
        </div>
        <div
          style={{
            padding: 8,
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2 style={{ color: fontColor, fontSize: 16, marginBottom: 8 }}>
            {t("Your receipts")}
          </h2>
          <div
            style={{
              background: headerAndButtonColor,
              borderRadius: 8,
              boxShadow: "0 1px 6px rgba(191,161,107,0.10)",
              marginBottom: 10,
              padding: 8,
              borderLeft: `3px solid ${fontColor}`,
              color: fontColor,
              position: "relative",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
              {t("Receipt")} #12345
            </div>
            <div style={{ fontSize: 14, marginBottom: 2 }}>
              <b>{t("Amount")}:</b> 2,500 RSD
            </div>
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                background: fontColor,
                color: headerAndButtonColor,
                borderRadius: "50%",
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 1px 2px rgba(0,0,0,0.10)",
              }}
              title={t("Points")}
            >
              5
            </div>
          </div>
        </div>

        <button
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            background: headerAndButtonColor,
            color: fontColor,
            fontWeight: 700,
            fontSize: 14,
            padding: "8px 0",
            border: "none",
            borderRadius: 0,
            zIndex: 2,
            boxShadow: "0 -1px 4px rgba(0,0,0,0.08)",
            letterSpacing: 1,
          }}
        >
          {t("Scan receipt")}
        </button>
      </div>
    </div>
  );
};

export default MobileSimulator;
