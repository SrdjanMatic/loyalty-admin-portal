import React from "react";
import { type Challenge } from "../../reducer/configApi";

interface ChallengesConfigProps {
  challengeList: Challenge[];
  onChallengeChange?: (
    idx: number,
    field: "period" | "visitsRequired",
    value: string
  ) => void;
  onAddChallenge?: () => void;
  onRemoveChallenge?: (idx: number) => void;
  viewMode?: boolean;
}

const ChallengesConfig: React.FC<ChallengesConfigProps> = ({
  challengeList,
  onChallengeChange,
  onAddChallenge,
  onRemoveChallenge,
  viewMode = false,
}) => (
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
        {challengeList?.map((challenge, idx) => (
          <tr key={idx}>
            <td>
              {viewMode ? (
                <span>{challenge.period}</span>
              ) : (
                <input
                  type="number"
                  value={challenge.period}
                  onChange={(e) =>
                    onChallengeChange?.(idx, "period", e.target.value)
                  }
                  style={{
                    width: 70,
                    padding: "6px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              )}
            </td>
            <td>
              {viewMode ? (
                <span>{challenge.visitsRequired}</span>
              ) : (
                <input
                  type="number"
                  value={challenge.visitsRequired}
                  onChange={(e) =>
                    onChallengeChange?.(idx, "visitsRequired", e.target.value)
                  }
                  style={{
                    width: 90,
                    padding: "6px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              )}
            </td>
            <td>
              {!viewMode && (
                <button
                  type="button"
                  onClick={() => onRemoveChallenge?.(idx)}
                  style={{
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  disabled={challengeList.length === 1}
                >
                  ×
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!viewMode && (
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={onAddChallenge}
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
    )}
  </div>
);

export default ChallengesConfig;
