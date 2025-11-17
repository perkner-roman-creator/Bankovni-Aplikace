import React, { useState } from 'react';

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Register({ onRegistered }) {
  const [jmeno, setJmeno] = useState('');
  const [email, setEmail] = useState('');
  const [heslo, setHeslo] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (jmeno.length < 3) {
      setMsg('Jméno musí mít alespoň 3 znaky');
      return;
    }
    if (!isEmailValid(email)) {
      setMsg('Zadejte platný email');
      return;
    }
    if (heslo.length < 5) {
      setMsg('Heslo musí mít alespoň 5 znaků');
      return;
    }
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jmeno, email, heslo })
    });
    const data = await res.json();
    if (data.success) {
      setMsg('Registrace úspěšná! Můžete se přihlásit.');
      if (typeof onRegistered === "function") {
        onRegistered();
      }
    } else {
      setMsg(data.message || 'Chyba při registraci');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eaf3fb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 0 0 2px #1e4663',
        padding: '32px 32px 24px 32px',
        maxWidth: '350px',
        width: '100%',
        textAlign: 'center'
      }}>
        <img
          src="/bank.png"
          alt="Logo"
          style={{
            width: 64,
            height: 64,
            marginBottom: 16,
            borderRadius: '50%',
            objectFit: 'cover',
            background: '#fff'
          }}
        />
        <h1 style={{
          margin: '0 0 24px 0',
          fontSize: '1.6rem', // stejná velikost jako hlavní nadpis
          color: '#111',
          fontWeight: 'bold'
        }}>
          Registrace
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Jméno"
            value={jmeno}
            onChange={e => setJmeno(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #dbe6f3',
              fontSize: '1rem'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #dbe6f3',
              fontSize: '1rem'
            }}
          />
          <input
            type="password"
            placeholder="Heslo"
            value={heslo}
            onChange={e => setHeslo(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '18px',
              borderRadius: '8px',
              border: '1px solid #dbe6f3',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e4663',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
          >
            Registrovat
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e4663',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/'}
          >
            Zpět na hlavní stranu
          </button>
          {msg && <div style={{ color: msg.includes('úspěšná') ? 'green' : 'red', marginTop: '12px' }}>{msg}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;