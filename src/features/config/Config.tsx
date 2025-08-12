import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetRestaurantConfigQuery,
  useSaveConfigMutation,
  type Challenge,
  type RestaurantConfig,
} from "../../reducer/configApi";
import MobileSimulator from "./MobileSimulator.tsx";
import GeneralConfigForm from "./GeneralConfigForm.tsx";
import ChallengesConfig from "./ChallengesConfig.tsx";

const defaultFontColor = "#222";
const defaultBackgroundColor = "#ffffff";
const defaultHeaderAndButtonColor = "#bfa16b";
const defaultDescription = "Vaši računi i lojalnost";

const Config: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurantIdNumber = restaurantId ? Number(restaurantId) : undefined;

  const {
    data: configData,
    isLoading,
    isError,
    error,
  } = useGetRestaurantConfigQuery(restaurantIdNumber, {
    skip: !restaurantIdNumber,
  });

  const [saveConfig, { isLoading: isSaving }] = useSaveConfigMutation();

  const [config, setConfig] = useState<RestaurantConfig>({
    fontColor: defaultFontColor,
    backgroundColor: defaultBackgroundColor,
    headerAndButtonColor: defaultHeaderAndButtonColor,
    restaurantDisplayName: "",
    restaurantName: "",
    description: defaultDescription,
    logo: null,
    backgroundImage: null,
    challengeList: [],
  });

  // Add view/edit mode state
  const [viewMode, setViewMode] = useState(true);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  const handleConfigChange = <K extends keyof RestaurantConfig>(
    key: K,
    value: RestaurantConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleChallengeChange = (
    idx: number,
    field: "period" | "visitsRequired",
    value: string
  ) => {
    setConfig((prev) => {
      const updated = [...prev.challengeList];
      updated[idx][field] = value === "" ? 1 : Number(value);
      return { ...prev, challengeList: updated };
    });
  };

  const handleAddChallenge = () => {
    setConfig((prev) => ({
      ...prev,
      challengeList: [...prev.challengeList, { period: 1, visitsRequired: 1 }],
    }));
  };

  const handleRemoveChallenge = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      challengeList: prev.challengeList.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveConfig = async () => {
    if (!restaurantIdNumber) return;
    const payload = {
      ...config,
      restaurantId: restaurantIdNumber,
      challengeList: config.challengeList?.filter(
        (c: Challenge) =>
          c.period &&
          c.visitsRequired &&
          !isNaN(Number(c.period)) &&
          !isNaN(Number(c.visitsRequired))
      ),
    };

    await saveConfig(payload);

    setViewMode(true); // Switch back to view mode after saving
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        padding: 0,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 32,
          padding: "48px 0",
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Edit/View mode button in top right corner */}
        <button
          type="button"
          onClick={() => setViewMode((v) => !v)}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: viewMode ? "#23272f" : "#bfa16b",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 18px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 15,
            zIndex: 2,
          }}
        >
          {viewMode ? "Edit" : "Preview"}
        </button>
        {/* Left: Main config and mobile preview */}
        <div style={{ flex: 2, minWidth: 0, display: "flex", gap: 32 }}>
          {/* General Config Form */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              padding: 32,
              flex: 1,
              minWidth: 320,
              maxWidth: 480,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>
              Podešavanje restorana
            </h2>
            <GeneralConfigForm
              config={config}
              viewMode={viewMode}
              onConfigChange={handleConfigChange}
            />
          </div>
          {/* Mobile Simulator */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              padding: 24,
              minWidth: 320,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <MobileSimulator config={config} />
            {!viewMode && (
              <button
                type="button"
                onClick={handleSaveConfig}
                style={{
                  marginTop: 24,
                  background: "#bfa16b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "10px 28px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  letterSpacing: 1,
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            )}
            {isError && (
              <span style={{ color: "red", marginTop: 8 }}>
                Error: {String(error)}
              </span>
            )}
          </div>
        </div>
        {/* Challenges Config */}
        <ChallengesConfig
          challengeList={config.challengeList}
          onChallengeChange={handleChallengeChange}
          onAddChallenge={handleAddChallenge}
          onRemoveChallenge={handleRemoveChallenge}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default Config;
