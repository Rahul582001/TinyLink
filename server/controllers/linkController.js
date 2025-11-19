const validUrl = require('valid-url');
const Link = require('../models/Link');
const generateUniqueCode = require('../utils/generateCode');

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

exports.createLink = async (req, res, next) => {
  try {
    const { url, code } = req.body;
    console.log('createLink request body:', req.body);
    if (!url || !validUrl.isWebUri(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let finalCode = code;
    if (finalCode) {
      if (!CODE_REGEX.test(finalCode)) {
        return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
      }
      const exists = await Link.findOne({ code: finalCode });
      if (exists) return res.status(409).json({ error: 'Code already exists' });
    } else {
      finalCode = await generateUniqueCode(Link, 6);
    }

    const link = await Link.create({ url, code: finalCode });
    console.log('Link created:', link.code)
    return res.status(201).json(link);
  } catch (err) {
    console.error('createLink error:', err && err.message)
    // send descriptive error in dev, generic in production
    if (process.env.NODE_ENV === 'production') return next(err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
};

exports.listLinks = async (req, res, next) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    next(err);
  }
};

exports.getLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json(link);
  } catch (err) {
    next(err);
  }
};

exports.deleteLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findOneAndDelete({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.redirect = async (req, res, next) => {
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
};
