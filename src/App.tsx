import React, { useEffect } from "react";
import RestaurantsTable from "./features/restaurants/RestaurantsTable.tsx";
import Sidebar from "./sidebar/sidebar.tsx";
import { useKeycloak } from "@react-keycloak/web";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Config from "./features/config/Config.tsx";
import CouponsTable from "./features/coupons/CouponsTable.tsx";
import { Dashboard } from "./features/dashboard/Dashboard.tsx";
import CompanyTable from "./features/company/CompanyTable.tsx";
import EmployeesTable from "./features/employee/EmployeeTable.tsx";
import VipRestaurantsTable from "./features/restaurants/VipRestaurantsTable.tsx";
import NotificationTable from "./features/notification/NotificationTable.tsx";
import RestaurantAdminTable from "./features/restaurantAdmins/RestaurantAdminTable.tsx";
import { ToastSnackbar } from "./features/errors/ToastSnackbar.tsx";
import { useTranslation } from "react-i18next";
import Header from "./features/header/Header.tsx";

const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const { i18n } = useTranslation();

  const roles: string[] = keycloak?.tokenParsed?.realm_access?.roles || [];
  const username: string | undefined =
    keycloak?.tokenParsed?.preferred_username;

  const getDefaultRoute = (roles: string[]) => {
    if (roles.includes("System admin")) return "/dashboard";
    if (roles.includes("Restaurant admin")) return "/dashboard";
    return "/no-access";
  };

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated) {
      keycloak.login();
    } else {
      const roles: string[] = keycloak?.tokenParsed?.realm_access?.roles || [];
      const allowedRoles = ["System admin", "Restaurant admin"];
      const hasAccess = roles.some((role) => allowedRoles.includes(role));

      if (!hasAccess) {
        keycloak.logout();
      }
    }
  }, [initialized, keycloak]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
    return null;
  }

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + "/",
    });
  };

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Router>
      <ToastSnackbar />
      <Sidebar />
      <Header
        onLogout={handleLogout}
        currentLang={i18n.language}
        onLangChange={handleLangChange}
        username={username}
      />
      <div
        style={{
          marginLeft: 220,
          marginTop: 64,
          background: "#f5f6fa",
          minHeight: "100vh",
          padding: 16,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute(roles)} replace />}
          />
          <Route path="/restaurants" element={<RestaurantsTable />} />
          <Route path="/companies" element={<CompanyTable />} />
          <Route path="/config/:restaurantId" element={<Config />} />
          <Route path="/coupons/:restaurantId" element={<CouponsTable />} />
          <Route
            path="/notification/:restaurantId"
            element={<NotificationTable />}
          />
          <Route path="/employee/:companyId" element={<EmployeesTable />} />
          <Route path="/restaurantAdmins" element={<RestaurantAdminTable />} />
          <Route path="/no-access" element={<div>No access</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vip-restaurants" element={<VipRestaurantsTable />} />
          <Route path="*" element={<Navigate to="/test" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
