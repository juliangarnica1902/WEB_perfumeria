// routes/products.js
const express = require('express');
const router = express.Router();
const productsData = require('../data/products');

// Listado de productos (panel de administración simple)
router.get('/', (req, res) => {
  const products = productsData.getAll();
  res.render('products/list', {
    title: 'Perfumes — ESSENZA',
    products
  });
});

// Formulario: crear producto
router.get('/nuevo', (req, res) => {
  res.render('products/form', {
    title: 'Nuevo producto — ESSENZA',
    formAction: '/productos',
    formMethod: 'POST',
    product: { brand: '', name: '', description: '', price: '', badge: '', category: 'mujer', image: '' },
    heading: 'Añadir un nuevo perfume'
  });
});

// Crear producto
router.post('/', (req, res) => {
  const { brand, name, description, price } = req.body;

  if (!brand || !name || !description || !price) {
    return res.status(400).render('products/form', {
      title: 'Nuevo producto — ESSENZA',
      formAction: '/productos',
      formMethod: 'POST',
      product: req.body,
      heading: 'Añadir un nuevo perfume',
      error: 'Completa marca, nombre, descripción y precio.'
    });
  }

  productsData.create(req.body);
  res.redirect('/productos');
});

// Formulario: editar producto
router.get('/:id/editar', (req, res) => {
  const product = productsData.getById(req.params.id);
  if (!product) return res.status(404).send('Producto no encontrado');

  res.render('products/form', {
    title: `Editar ${product.name} — ESSENZA`,
    formAction: `/productos/${product.id}?_method=PUT`,
    formMethod: 'POST',
    product,
    heading: `Editar ${product.brand} — ${product.name}`
  });
});

// Actualizar producto (llega como PUT gracias a method-override)
router.put('/:id', (req, res) => {
  const { brand, name, description, price } = req.body;

  if (!brand || !name || !description || !price) {
    return res.status(400).render('products/form', {
      title: 'Editar producto — ESSENZA',
      formAction: `/productos/${req.params.id}?_method=PUT`,
      formMethod: 'POST',
      product: { ...req.body, id: req.params.id },
      heading: 'Editar perfume',
      error: 'Completa marca, nombre, descripción y precio.'
    });
  }

  const updated = productsData.update(req.params.id, req.body);
  if (!updated) return res.status(404).send('Producto no encontrado');

  res.redirect('/productos');
});

// Eliminar producto (llega como DELETE gracias a method-override)
router.delete('/:id', (req, res) => {
  productsData.remove(req.params.id);
  res.redirect('/productos');
});

module.exports = router;
