import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { apiPost } from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              email: form.email,
              password: form.password,
              firstName: form.firstName || "Employee",
              lastName: form.lastName || "Portal",
              role: "EMPLOYEE",
            };

      const response = await apiPost(endpoint, payload);

      if (mode === "login") {
        const token = response?.token;
        if (token) {
          localStorage.setItem("portalToken", token);
          window.dispatchEvent(new Event("authchange"));
        }
        if (response?.user) {
          localStorage.setItem("portalUser", JSON.stringify(response.user));
        }
        navigate("/");
      } else {
        setSuccess(response?.message || "Employé enregistré");
        setMode("login");
        setForm({ email: "", password: "", firstName: "", lastName: "" });
      }
    } catch (err) {
      setError(
        err.message ||
          (mode === "login"
            ? "Erreur de connexion"
            : "Erreur d'enregistrement"),
      );
    }
  };

  return (
    <div className="body-page">
      <div className="logincontent">
        <form className="login-form-user" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <h3>Internal Portal</h3>

          <div className="content-link" style={{ marginBottom: "12px" }}>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
            >
              Créer un compte
            </button>
          </div>

          {mode === "register" && (
            <>
              <label htmlFor="firstName">Prénom :</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Prénom"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />

              <label htmlFor="lastName">Nom :</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Nom"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </>
          )}

          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="enter your email here"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label htmlFor="password">Password :</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="content-link">
            <button type="submit">
              {mode === "login" ? "Connect" : "Enregistrer"}
            </button>
            <FontAwesomeIcon icon={faGoogle} className="home-icone" />
          </div>

          {error && (
            <p
              className="error-message"
              style={{ color: "red", marginTop: "10px" }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="success-message"
              style={{ color: "green", marginTop: "10px" }}
            >
              {success}
            </p>
          )}
        </form>
      </div>

      <div className="login-desc">
        <h1>Internal Portal</h1>
        <h2>Nexus Group Advisory</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa debitis
          voluptatem aperiam vel! <br /> Libero repellat itaque eius, magni qui
          quos possimus consectetur enim placeat <br /> quas nisi, unde
          excepturi ut tempore.
        </p>
      </div>
    </div>
  );
}
