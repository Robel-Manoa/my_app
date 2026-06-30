import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:3001/api/auth/login", form, {
        withCredentials: true,
      });

      
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <div className="body-page">
        <div className="logincontent">
          <form className="login-form-user" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <h3>Internal Portal</h3>

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
              <button type="submit">Connect</button>
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
          </form>
        </div>

        <div className="login-desc">
          <h1>Internal Portal</h1>
          <h2>Nexus Group Advisory</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
            debitis voluptatem aperiam vel! <br /> Libero repellat itaque eius,
            magni qui quos possimus consectetur enim placeat <br /> quas nisi,
            unde excepturi ut tempore.
          </p>
        </div>
      </div>
    </>
  );
}
