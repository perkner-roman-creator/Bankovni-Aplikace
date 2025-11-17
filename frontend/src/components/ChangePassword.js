import React, { useState } from 'react';

function ChangePassword({ userId }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:3001/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, oldPass, newPass })
    });
    const data = await res.json();
    if (data.success) {
      setMsg('Heslo bylo změněno.');
      setOldPass('');
      setNewPass('');
    } else {
      setMsg(data.message || 'Chyba při změně hesla.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Změna hesla</h3>
      <input
        type="password"
        placeholder="Staré heslo"
        value={oldPass}
        onChange={e => setOldPass(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Nové heslo"
        value={newPass}
        onChange={e => setNewPass(e.target.value)}
        required
      />
      <button type="submit">Změnit heslo</button>
      {msg && <div style={{ color: msg.includes('změněno') ? 'green' : 'red' }}>{msg}</div>}
    </form>
  );
}

export default ChangePassword;