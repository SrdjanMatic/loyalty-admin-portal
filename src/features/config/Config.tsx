import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store.ts";
import {
  getRestaurantConfigData,
  saveConfig,
  type Challenge,
} from "../../reducer/configSlice.ts";
import MobileSimulator from "./MobileSimulator.tsx";
import GeneralConfigForm from "./GeneralConfigForm.tsx";
import { useParams } from "react-router-dom";

const defaultFontColor = "#222";
const defaultBackgroundColor = "#ffffff";
const defaultHeaderAndButtonColor = "#bfa16b";
const defaultDescription = "Vaši računi i lojalnost";

const Config: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurantIdNumber = restaurantId ? Number(restaurantId) : undefined;

  const [config, setConfig] = useState({
    fontColor: defaultFontColor,
    backgroundColor: defaultBackgroundColor,
    headerAndButtonColor: defaultHeaderAndButtonColor,
    restaurantDisplayName: "",
    description: defaultDescription,
    logo: null as string | null,
    backgroundImage: null as string | null,
    challengeList: [] as Challenge[],
  });

  const handleConfigChange = <K extends keyof typeof config>(
    key: K,
    value: (typeof config)[K]
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

  const dispatch = useDispatch<AppDispatch>();
  const { configData, status, error } = useSelector(
    (state: RootState) => state.restaurantConfig
  );

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

  const handleSaveConfig = () => {
    if (!restaurantId) return;
    dispatch(
      saveConfig({
        ...config,
        restaurantId: Number(restaurantId),
        challengeList: config.challengeList?.filter(
          (c: Challenge) =>
            !c.id &&
            c.period &&
            c.visitsRequired &&
            !isNaN(Number(c.period)) &&
            !isNaN(Number(c.visitsRequired))
        ),
        restaurantName: "",
      })
    );
  };

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantConfigData(restaurantIdNumber));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

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
        }}
      >
        {/* Left: Main config and mobile preview */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              width: "100%",
            }}
          >
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
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>
                Podešavanje restorana
              </h2>
              <GeneralConfigForm
                config={config}
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
              <button
                type="button"
                onClick={() => handleSaveConfig()}
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
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 420,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            padding: 32,
            marginTop: 0,
            position: "sticky",
            top: 48,
            alignSelf: "flex-start",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700 }}>
            Challenges
          </h3>
          <div style={{ marginBottom: 20 }}></div>
          <table style={{ width: "100%", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, fontWeight: 600 }}>
                  Period
                </th>
                <th style={{ textAlign: "left", padding: 8, fontWeight: 600 }}>
                  Visits
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {config?.challengeList?.map((challenge, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="number"
                      value={challenge.period}
                      onChange={(e) =>
                        handleChallengeChange(idx, "period", e.target.value)
                      }
                      style={{
                        width: 70,
                        padding: "6px 8px",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={challenge.visitsRequired}
                      onChange={(e) =>
                        handleChallengeChange(
                          idx,
                          "visitsRequired",
                          e.target.value
                        )
                      }
                      style={{
                        width: 90,
                        padding: "6px 8px",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveChallenge(idx)}
                      style={{
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      disabled={config?.challengeList.length === 1}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button
              type="button"
              onClick={handleAddChallenge}
              style={{
                background: "#23272f",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Add Challenge
            </button>
          </div>
          {status === "loading" && (
            <span style={{ color: "#bfa16b" }}>Saving...</span>
          )}
          {status === "succeeded" && (
            <span style={{ color: "green" }}>Saved!</span>
          )}
          {status === "failed" && (
            <span style={{ color: "red" }}>Error: {error}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Config;
