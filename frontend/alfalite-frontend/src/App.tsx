import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import "./App.css";
import { CustomSelect } from "./components/CustomLaguageSelect";

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("alfalite_token");
  if (!token) return <Navigate to="/admin" />;

  // Validación básica: decodificar JWT (sin librería)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem("alfalite_token");
      return <Navigate to="/admin" />;
    }
  } catch {
    localStorage.removeItem("alfalite_token");
    return <Navigate to="/admin" />;
  }

  return children;
};

const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  const { t, i18n } = useTranslation();

  return (
    <BrowserRouter>
      <div className="language-switcher">
        <span className="lang-label">{t("language")}:</span>
        <CustomSelect
          options={LANGUAGES}
          value={i18n.language.split("-")[0]}
          onChange={(code) => i18n.changeLanguage(code)}
        />
      </div>
      <Suspense fallback={<div className="loading">{t("loading")}</div>}>
        <Routes>
          <Route path="/" element={<ConfiguratorPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/admin" element={<AuthPage />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
