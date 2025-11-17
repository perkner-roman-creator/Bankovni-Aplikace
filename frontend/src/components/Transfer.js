import React, { useState } from 'react';

function Transfer({ accountId, onTransfer, disabled = false }) {
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!accountId) return setMsg('Musíte být přihlášený a načtený účet.');
    if (!targetId || !amount) return setMsg('Vyplňte prosím oba údaje.');
    setLoading(true);
    const result = await onTransfer(targetId, amount);
    setLoading(false);
    if (result?.success) {
      setMsg('Převod proběhl úspěšně!');
      setTargetId('');
      setAmount('');
    } else {
      setMsg(result?.error || 'Chyba při převodu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="input" placeholder="ID cílového účtu" value={targetId} onChange={e => setTargetId(e.target.value)} disabled={disabled} />
      <input className="input" placeholder="Částka" type="number" value={amount} onChange={e => setAmount(e.target.value)} disabled={disabled} />
      <button className="primary" type="submit" disabled={loading || disabled}>{loading ? 'Odesílám…' : 'Odeslat'}</button>
      {msg && <div style={{ color: msg.includes('úspěšně') ? 'green' : 'red', marginTop: 8 }}>{msg}</div>}
    </form>
  );
}

export default Transfer;