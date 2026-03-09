import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

// Componente para proteger la ruta
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("alfalite_token");
  return token ? children : <Navigate to="/" />;
};

const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Cargando Página...</div>}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
