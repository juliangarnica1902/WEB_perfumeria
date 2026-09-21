// routes/home.js
const express = require('express');
const router = express.Router();
const productsData = require('../data/products');

router.get('/', (req, res) => {
  const products = productsData.getAll();
  // La portada muestra hasta 3 productos destacados.
  const featured = products.slice(0, 3);

  res.render('home/index', {
    title: 'ESSENZA — Perfumería original',
    featured
  });
});

module.exports = router;
