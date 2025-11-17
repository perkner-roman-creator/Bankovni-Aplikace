import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ onRegistered }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ...registrace uživatele...
    onRegistered(); // Přidáno volání onRegistered
    navigate("/login");
  };

  return (
    <div className="App">
      <div className="card">
        <div className="logo">
          <img src="/logo192.png" alt="Logo" />
        </div>
        <h1>Bankovní aplikace</h1>
        <h3>Registrace</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Jméno" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Heslo" />
          <button className="primary">Registrovat</button>
        </form>
      </div>
    </div>
  );
}