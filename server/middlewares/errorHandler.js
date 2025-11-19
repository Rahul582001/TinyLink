module.exports = (err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};
