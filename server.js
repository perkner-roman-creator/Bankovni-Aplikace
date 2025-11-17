const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';
const DATA_PATH = path.join(__dirname, 'data.json');

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ success: false, error: 'No token' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

app.use(cors());
app.use(express.json());

// Registrace uživatele
app.post('/register', (req, res) => {
  const { jmeno, email, heslo } = req.body;
  const data = loadData();
  if (data.users.find(u => u.email === email)) {
    return res.json({ success: false, message: 'Email už existuje!' });
  }
  const userId = data.users.length + 1;
  data.users.push({ id: userId, jmeno, email, heslo, role: 'user' });
  data.accounts.push({ id: data.accounts.length + 1, userId, zustatek: 0 });
  saveData(data);
  res.json({ success: true });
});

// Přihlášení uživatele
app.post('/login', (req, res) => {
  const { email, heslo } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.email === email && u.heslo === heslo);
  if (!user) return res.status(401).json({ success: false, error: 'Neplatné přihlašovací údaje' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

// Načtení účtu
app.get('/account/:userId', (req, res) => {
  const data = loadData();
  const acc = data.accounts.find(a => a.userId == req.params.userId);
  if (!acc) return res.status(404).json({ error: 'Účet nenalezen' });
  res.json(acc);
});

// Převod peněz
app.post('/transfer', authMiddleware, (req, res) => {
  const { od, do_: doTo, castka } = req.body || {};
  const data = loadData();
  const from = data.accounts.find(a => a.id === Number(od));
  const to = data.accounts.find(a => a.id === Number(doTo));
  const amount = Number(castka);

  if (!from || !to) return res.status(404).json({ success: false, error: 'Účet neexistuje' });
  if (amount <= 0) return res.status(400).json({ success: false, error: 'Částka musí být kladná' });
  if (from.zustatek < amount) return res.status(400).json({ success: false, error: 'Nedostatečný zůstatek' });

  from.zustatek -= amount;
  to.zustatek += amount;

  data.transactions.push({
    id: data.transactions.length + 1,
    ucet_od: from.id,
    ucet_do: to.id,
    castka: amount,
    datum: new Date().toISOString()
  });

  saveData(data);
  res.json({ success: true });
});

// Výpis transakcí
app.get('/transactions/:accountId', authMiddleware, (req, res) => {
  const accountId = Number(req.params.accountId);
  const data = loadData();
  // Uživatel vidí jen své transakce nebo admin vše
  if (req.user.role !== 'admin' && req.user.id !== accountId) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  const trans = data.transactions.filter(t => t.ucet_od === accountId || t.ucet_do === accountId);
  res.json(trans);
});

// Změna hesla
app.post('/change-password', (req, res) => {
  const { userId, oldPass, newPass } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.id == userId);
  if (user && user.heslo === oldPass) {
    user.heslo = newPass;
    saveData(data);
    return res.json({ success: true });
  }
  res.json({ success: false, message: 'Staré heslo je nesprávné.' });
});

// Výpis všech uživatelů (jen admin)
app.get('/users', authMiddleware, (req, res) => {
  const data = loadData();
  const user = data.users.find(u => u.id === req.user.id);
  if (user && user.role === 'admin') {
    return res.json(data.users);
  }
  res.status(403).json({ message: 'Přístup zamítnut.' });
});

app.listen(3001, () => {
  console.log('Server běží na portu 3001');
});