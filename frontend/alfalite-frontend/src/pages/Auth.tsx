import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";
import "./Auth.css"; // Asegúrate de importar tu CSS
import { API_BASE_URL } from "../api/apiClient"; // cliente centralizado de la API

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(t("processing"));

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("alfalite_token", data.access_token);
          showSuccess(t("accessGranted"));
          setStatus(t("accessGranted"));
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          showSuccess(t("registrationSuccess"));
          setStatus(t("registrationSuccess"));
          setIsLogin(true);
        }
      } else {
        const errMsg = data?.message ? data.message : t("operationError");
        showError(errMsg);
        setStatus(errMsg);
      }
    } catch (error) {
      showError(t("connectionError"));
      setStatus(t("connectionError"));
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h2>{isLogin ? t("authTitleLogin") : t("authTitleRegister")}</h2>

        <form onSubmit={handleAction}>
          <div className="input-group">
            <input
              type="text"
              placeholder={t("username")}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder={t("password")}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {isLogin ? t("login") : t("createAccount")}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
          {isLogin ? t("toggleRegister") : t("toggleLogin")}
        </button>

        <p
          className="status-msg"
          style={{
            color: status === t("accessGranted") ? "#4caf50" : "#ff4444",
          }}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
