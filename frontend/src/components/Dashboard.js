import React, { useEffect, useState } from 'react';
import Transfer from './Transfer';
import Transactions from './Transactions';

function Dashboard({ userId, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadAccount = async () => {
    setLoadingAcc(true);
    try {
      const res = await fetch(`http://localhost:3001/account/${userId}`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Nepodařilo se načíst účet');
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error('loadAccount', err);
      setAccount(null);
    } finally {
      setLoadingAcc(false);
    }
  };

  const loadTransactions = async () => {
    if (!account) return;
    try {
      const res = await fetch(`http://localhost:3001/transactions/${account.id}`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Nepodařilo se načíst transakce');
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error('loadTransactions', err);
      setTransactions([]);
    }
  };

  useEffect(() => { loadAccount(); }, [userId]);
  useEffect(() => { loadTransactions(); }, [account]);

  const handleTransfer = async (targetId, amount) => {
    try {
      const res = await fetch('http://localhost:3001/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ od: account.id, do_: Number(targetId), castka: Number(amount) })
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { success: false, error: text || 'Neznámá chyba' }; }
      console.log('/transfer', res.status, data);
      if (!res.ok || !data.success) return { success: false, error: data.error || 'Chyba při převodu' };

      // přidáme transakci a aktualizujeme účet
      setTransactions(prev => [data.transaction, ...prev]);
      await loadAccount();
      return { success: true };
    } catch (err) {
      console.error('handleTransfer', err);
      return { success: false, error: 'Síťová chyba' };
    }
  };

  if (loadingAcc) return <div className="card">Načítání...</div>;
  if (!account) return <div className="card">Nepodařilo se načíst účet. <button onClick={onLogout}>Zpět</button></div>;

  return (
    <div className="card">
      <div className="logo"><img src="/bank.png" alt="logo" /></div>
      <div className="balance">{`Vítejte! Zůstatek: ${account.zustatek} Kč`}</div>
      <h3>Převod peněz</h3>
      <Transfer accountId={account.id} onTransfer={handleTransfer} />
      <h3 style={{ textAlign: 'center', marginTop: 12 }}>Historie transakcí</h3>
      <Transactions transactions={transactions} />
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button className="ghost" onClick={onLogout}>Odhlásit se</button>
      </div>
    </div>
  );
}

export default Dashboard;