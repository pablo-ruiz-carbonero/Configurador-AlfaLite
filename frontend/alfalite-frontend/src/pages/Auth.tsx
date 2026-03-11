import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Asegúrate de importar tu CSS
import { API_URL } from "../api/apiClient"; // cliente centralizado de la API

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Procesando...");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("alfalite_token", data.access_token);
          setStatus("✅ Acceso concedido");
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setStatus("✅ Registro completado con éxito");
          setIsLogin(true);
        }
      } else {
        setStatus(`❌ ${data.message || "Error en la operación"}`);
      }
    } catch (error) {
      setStatus("❌ Error de conexión");
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h2>{isLogin ? "Alfalite" : "Nuevo Admin"}</h2>

        <form onSubmit={handleAction}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {isLogin ? "Entrar" : "Crear Cuenta"}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
          {isLogin ? "Solicitar acceso de administrador" : "Volver al login"}
        </button>

        <p
          className="status-msg"
          style={{ color: status.includes("✅") ? "#4caf50" : "#ff4444" }}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
