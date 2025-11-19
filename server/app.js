const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const linkRoutes = require('./routes/linkRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//app.use(cors());
const cors = require('cors');

const allowedOrigins = [
  'https://tinylink-gold-one.vercel.app',  // your frontend live URL
  'http://localhost:5173',                 // for local development
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});

app.use('/api/links', linkRoutes);

// redirect route handled separately in server.js to ensure it comes after API

app.use(errorHandler);

module.exports = app;
