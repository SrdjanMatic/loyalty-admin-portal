import React from "react";

interface Props {
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
  onConfigChange: <K extends keyof Props["config"]>(
    key: K,
    value: Props["config"][K]
  ) => void;
}

const GeneralConfigForm: React.FC<Props> = ({ config, onConfigChange }) => {
  const {
    fontColor,
    backgroundColor,
    headerAndButtonColor,
    restaurantDisplayName,
    description,
    backgroundImage,
    logo,
  } = config;

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "logo" | "backgroundImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onConfigChange(key, ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <h3 style={{ fontSize: 20, marginBottom: 20 }}>General Config</h3>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Logo: </b>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "logo")}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Background Image: </b>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "backgroundImage")}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Font Color: </b>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => onConfigChange("fontColor", e.target.value)}
            style={{
              marginLeft: 8,
              width: 32,
              height: 24,
              border: "none",
              background: "none",
            }}
          />
          <span style={{ marginLeft: 8 }}>{fontColor}</span>
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Background Color: </b>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onConfigChange("backgroundColor", e.target.value)}
            style={{
              marginLeft: 8,
              width: 32,
              height: 24,
              border: "none",
              background: "none",
            }}
          />
          <span style={{ marginLeft: 8 }}>{backgroundColor}</span>
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Header and button Color: </b>
          <input
            type="color"
            value={headerAndButtonColor}
            onChange={(e) =>
              onConfigChange("headerAndButtonColor", e.target.value)
            }
            style={{
              marginLeft: 8,
              width: 32,
              height: 24,
              border: "none",
              background: "none",
            }}
          />
          <span style={{ marginLeft: 8 }}>{headerAndButtonColor}</span>
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Restaurant Name: </b>
          <input
            type="text"
            value={restaurantDisplayName}
            onChange={(e) =>
              onConfigChange("restaurantDisplayName", e.target.value)
            }
            style={{
              marginLeft: 8,
              padding: 4,
              fontSize: 16,
              width: 180,
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Description: </b>
          <input
            type="text"
            value={description}
            onChange={(e) => onConfigChange("description", e.target.value)}
            style={{
              marginLeft: 8,
              padding: 4,
              fontSize: 16,
              width: 220,
            }}
          />
        </label>
      </div>
    </>
  );
};

export default GeneralConfigForm;
