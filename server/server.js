require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const Link = require('./models/Link');
const { redirect } = require('./controllers/linkController');

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tinylink';
//first we connect to DB then start server
connectDB(MONGODB_URI).then(() => {
  // mount redirect route after DB connected
  app.get('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const link = await Link.findOne({ code });
      if (!link) return res.status(404).send('Not found');
      link.clicks = (link.clicks || 0) + 1;
      link.lastClicked = new Date();
      await link.save();
      return res.redirect(302, link.url);
    } catch (err) {
      next(err);
    }
  });

  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server', err);
});
