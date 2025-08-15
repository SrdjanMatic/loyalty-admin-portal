import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import loyaltyLogo from "../assets/loyaltyLogo.jpg";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const roles: string[] = keycloak?.tokenParsed?.realm_access?.roles || [];
  const restaurantId = keycloak?.tokenParsed?.restaurantId;

  const menuItems = [
    {
      role: "Restaurant admin",
      path: "/dashboard",
      label: t("Dashboard"),
    },
    {
      role: "System admin",
      path: "/dashboard",
      label: t("Dashboard"),
    },
    {
      role: "System admin",
      path: "/vip-restaurants",
      label: t("Vip restaurants"),
    },
    {
      role: "System admin",
      path: "/companies",
      label: t("Companies"),
    },
    {
      role: "System admin",
      path: "/restaurants",
      label: t("Restaurants"),
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/config/${restaurantId}`,
      label: t("Config"),
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/coupons/${restaurantId}`,
      label: t("Coupons"),
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/notification/${restaurantId}`,
      label: t("Notifications"),
    },
    {
      role: "System admin",
      path: "/restaurantAdmins",
      label: t("Restaurant Admins"),
    },
  ];

  const linkStyle = {
    padding: "12px 24px",
  };

  const textStyle = {
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#23272f",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
      }}
    >
      <img src={loyaltyLogo} height={100} width={"100%"} />

      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map(({ role, path, label }, idx) => {
            if (!roles.includes(role)) return null;

            const resolvedPath =
              typeof path === "function" ? path(restaurantId) : path;

            return (
              <li key={idx} style={linkStyle}>
                <Link to={resolvedPath} style={textStyle}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
