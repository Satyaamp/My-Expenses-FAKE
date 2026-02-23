require('dotenv').config();
const path = require('path');
const fs = require('fs');
const app = require('./src/app');
const connectDB = require('./src/config/db');

// ✅ Render-safe port
const PORT = process.env.PORT || 5000;

// ✅ Serve Static Files (CSS, JS, Images)
app.use(require('express').static(path.join(__dirname, '../frontend')));

// ✅ Clean URL Routes (Serve HTML without extension)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../frontend/login.html')));

app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../frontend/signup.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dashboard.html')));
app.get('/monthly', (req, res) => res.sendFile(path.join(__dirname, '../frontend/monthly.html')));
app.get('/yearly', (req, res) => res.sendFile(path.join(__dirname, '../frontend/yearly.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '../frontend/profile.html')));
app.get('/forgot-password', (req, res) => res.sendFile(path.join(__dirname, '../frontend/forgot-password.html')));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, '../frontend/reset-password.html')));
app.get('/sitemap', (req, res) => res.sendFile(path.join(__dirname, '../frontend/sitemap.html')));

// 404 Fallback for unknown routes
app.get(/.*/, (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

// ✅ Connect DB before starting server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });