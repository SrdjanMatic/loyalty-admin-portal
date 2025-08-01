import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Link } from "react-router-dom";

import loyaltyLogo from "../assets/loyaltyLogo.jpg";

const Sidebar: React.FC = () => {
  const { keycloak } = useKeycloak();
  const roles: string[] = keycloak?.tokenParsed?.realm_access?.roles || [];
  const restaurantId = keycloak?.tokenParsed?.restaurantId;

  const menuItems = [
    {
      role: "Restaurant admin",
      path: "/dashboard",
      label: "Dashboard",
    },
    {
      role: "System admin",
      path: "/dashboard",
      label: "Dashboard",
    },
    {
      role: "System admin",
      path: "/vip-restaurants",
      label: "Vip restaurants",
    },
    {
      role: "System admin",
      path: "/companies",
      label: "Companies",
    },
    {
      role: "System admin",
      path: "/restaurants",
      label: "Restaurants",
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/config/${restaurantId}`,
      label: "Config",
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/coupons/${restaurantId}`,
      label: "Coupons",
    },
    {
      role: "Restaurant admin",
      path: (restaurantId: string) => `/notification/${restaurantId}`,
      label: "Notifications",
    },
    {
      role: "System admin",
      path: "/restaurantAdmins",
      label: "Restaurant Admins",
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
          <li style={{ position: "absolute", bottom: 70 }}>
            {!!keycloak.authenticated && (
              <button
                type="button"
                style={{
                  background: "#fff",
                  color: "#23272f",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  marginLeft: 16,
                }}
                onClick={() => {
                  keycloak.logout({
                    redirectUri: window.location.origin + "/",
                  });
                }}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
