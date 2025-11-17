import React, { useState } from 'react';

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [heslo, setHeslo] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, heslo })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMsg(data.error || 'Přihlášení selhalo');
      } else {
        localStorage.setItem('token', data.token);
        // pokud backend neposílá user, můžeš místo toho uložit dekódovaný token
        if (onLogin) onLogin(data.user || { id: data.userId || 1, email });
      }
    } catch (err) {
      console.error('Login error', err);
      setMsg('Síťová chyba při přihlášení');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="logo"><img src="/bank.png" alt="logo" /></div>
      <h1>Bankovní aplikace</h1>
      <h4>Přihlášení</h4>
      <form onSubmit={handleSubmit}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Heslo" value={heslo} onChange={e => setHeslo(e.target.value)} required />
        <button className="primary" type="submit" disabled={loading}>{loading ? 'Přihlašuji…' : 'Přihlásit se'}</button>
      </form>
      <div style={{ marginTop: 10 }}>
        <button className="ghost" type="button" onClick={() => onShowRegister && onShowRegister()}>
          Registrovat nový účet
        </button>
      </div>
      {msg && <div style={{ color: 'red', marginTop: 8 }}>{msg}</div>}
    </div>
  );
}

export default Login;