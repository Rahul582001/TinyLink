const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const linkRoutes = require('./routes/linkRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});

app.use('/api/links', linkRoutes);

// redirect route handled separately in server.js to ensure it comes after API

app.use(errorHandler);

module.exports = app;
