import React, { useEffect, useState } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token]);

  return (
    <div>
      <h3>Správa uživatelů (admin)</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.jmeno} ({u.email}) - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;