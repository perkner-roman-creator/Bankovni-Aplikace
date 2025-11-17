import React, { useState } from 'react';

function Transactions({ transactions = [] }) {
  const [filter, setFilter] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = transactions.filter(t =>
    t && t.datum &&
    (filter === '' ||
    String(t.castka).includes(filter) ||
    String(t.ucet_od).includes(filter) ||
    String(t.ucet_do).includes(filter))
  );

  const sorted = [...filtered].sort((a, b) =>
    sortDesc ? new Date(b.datum) - new Date(a.datum) : new Date(a.datum) - new Date(b.datum)
  );

  return (
    <div>
      <input className="input" placeholder="Filtr (částka, účet)" value={filter} onChange={e => setFilter(e.target.value)} />
      <div className="transactions-controls">
        <button className="btn" onClick={() => setSortDesc(!sortDesc)}>Řadit {sortDesc ? 'od nejnovějších' : 'od nejstarších'}</button>
      </div>

      {sorted.length === 0 ? (
        <div style={{ color: '#666', marginTop: 12 }}>Zatím žádné transakce.</div>
      ) : (
        <ul className="transactions-list">
          {sorted.map(t => (
            <li key={t.id}>{new Date(t.datum).toLocaleString('cs-CZ')} - {t.castka} Kč (od: {t.ucet_od}, do: {t.ucet_do})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;