const express = require('express');
const router = express.Router();
const controller = require('../controllers/linkController');
//Following REST API Rules POST,GET,DELETE
// API routes (mounted at /api/links in app.js)
router.post('/', controller.createLink); //create a short link
router.get('/', controller.listLinks);   //list all links
router.get('/:code', controller.getLink); //get link details
router.delete('/:code', controller.deleteLink); //delete a link

module.exports = router;
