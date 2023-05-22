const express = require('express');
const router = express.Router();


router.get('/hi', function(req, res, next) {
    res.render('hi.twig', { name: 'wassim' });
  });

  

  module.exports = router;
