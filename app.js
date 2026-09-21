// app.js
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const homeRoutes = require('./routes/home');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (css, js del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Parseo de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Permite que los formularios HTML envíen PUT/DELETE con ?_method=PUT
app.use(methodOverride('_method'));

// Rutas
app.use('/', homeRoutes);
app.use('/productos', productRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => {
  console.log(`ESSENZA corriendo en http://localhost:${PORT}`);
});
