import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (!user) {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    }
  }, [user]);

  const handleLogin = (userObj) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        showRegister ? (
          <Register onBack={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
        )
      ) : (
        <Dashboard userId={user.id} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;