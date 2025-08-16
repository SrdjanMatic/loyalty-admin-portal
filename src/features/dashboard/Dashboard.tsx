import { useKeycloak } from "@react-keycloak/web";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useGetDashboardStatisticQuery } from "../../reducer/dashboardApi";
import { useGetRestaurantsQuery } from "../../reducer/restaurantsApi";
import { useTranslation } from "react-i18next";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const roles: string[] = keycloak?.tokenParsed?.realm_access?.roles || [];
  const restaurantId = keycloak?.tokenParsed?.restaurantId;

  // Fetch restaurants with RTK Query
  const { data: restaurants = [], isLoading: isRestaurantsLoading } =
    useGetRestaurantsQuery();

  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const isSystemAdmin = roles.includes("System admin");
  const effectiveRestaurantId = isSystemAdmin ? selectedId : restaurantId;

  // Optionally set default selectedId for system admin
  useEffect(() => {
    if (isSystemAdmin && restaurants.length && !selectedId) {
      setSelectedId(restaurants[0].id);
    }
  }, [isSystemAdmin, restaurants, selectedId]);

  const { data: dashboardStats } = useGetDashboardStatisticQuery(
    effectiveRestaurantId!,
    {
      skip: !effectiveRestaurantId,
    }
  );

  const foodPreferences = Object.entries(
    dashboardStats?.foodPreferencesMap || {}
  ).map(([type, count]) => ({
    type,
    count,
  }));

  const receiptsMap = Object.entries(dashboardStats?.receiptsPerDay || {}).map(
    ([type, count]) => ({
      type,
      count,
    })
  );

  return (
    <div
      style={{
        padding: 32,
        fontFamily: "sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Dropdown for system_admins */}
      {roles.includes("System admin") && (
        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="restaurant-select"
            style={{ marginRight: 12, fontWeight: "bold" }}
          >
            {t("Select Restaurant")}:
          </label>
          <select
            id="restaurant-select"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 6, fontSize: 16 }}
            disabled={isRestaurantsLoading}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 32,
          maxWidth: 600,
        }}
      >
        <h2 style={{ marginBottom: 16 }}>{t("Restaurant Info")}</h2>
        <p>
          <strong>{t("Name")}:</strong> {dashboardStats?.restaurantName}
        </p>
        <p>
          <strong>{t("PIB")}:</strong> {dashboardStats?.pib}
        </p>
        <p>
          <strong>{t("Address")}:</strong> {dashboardStats?.address}
        </p>
        <p>
          <strong>{t("Phone")}:</strong> {dashboardStats?.phone}
        </p>
      </div>

      {/* Total Users Card */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 32,
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        <h3>{t("Total Loyalty Users")}</h3>
        <p
          style={{ fontSize: 48, fontWeight: "bold", margin: 0, color: "#333" }}
        >
          {dashboardStats?.loyaltyUsers}
        </p>
      </div>

      {/* Scanned Receipts Chart */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>{t("Scanned Receipts Per Day")}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={receiptsMap}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>{t("Food Preferences")}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={foodPreferences}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#bfa16b" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
