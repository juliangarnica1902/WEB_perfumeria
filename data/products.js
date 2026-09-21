

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'products.json');

// Datos iniciales, usados solo si products.json todavía no existe.
const SEED_PRODUCTS = [
  {
    id: 1,
    brand: 'Valentino',
    name: 'Born in Roma',
    description: 'Ámbar floral, fresco, con notas de sándalo y vainilla.',
    price: 185000,
    badge: '-15%',
    category: 'mujer',
    image: ''
  },
  {
    id: 2,
    brand: 'Versace',
    name: 'Eros',
    description: 'Menta, manzana verde y vainilla. Fresco, dulce y masculino.',
    price: 425000,
    badge: '',
    category: 'hombre',
    image: 'https://www.google.com/imgres?q=imagen%20versace%20eros&imgurl=https%3A%2F%2Fmedia.falabella.com%2FfalabellaCO%2F9761893_1%2Fw%3D1500%2Ch%3D1500%2Cfit%3Dcover&imgrefurl=https%3A%2F%2Fwww.falabella.com.co%2Ffalabella-co%2Fproduct%2F9761893%2FPerfume-Versace-Eros-Hombre-100-ml-EDP%2F9761893&docid=_jVOnS-PtjcoEM&tbnid=nZxT_Ld3Axd7AM&vet=12ahUKEwiS6J2N_PqWAxUPTDABHepgAwQQnPAOegQISxAA..i&w=1500&h=1500&hcb=2&ved=2ahUKEwiS6J2N_PqWAxUPTDABHepgAwQQnPAOegQISxAA'
  },
  {
    id: 3,
    brand: 'Carolina Herrera',
    name: 'CH 24 VIP',
    description: 'Elegante y sofisticado, con notas orientales y amaderadas.',
    price: 359000,
    badge: 'Nuevo',
    category: 'mujer',
    image: ''
  }
];

function ensureDbFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED_PRODUCTS, null, 2), 'utf-8');
  }
}

function readAll() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('products.json corrupto, reiniciando con datos semilla:', err.message);
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED_PRODUCTS, null, 2), 'utf-8');
    return SEED_PRODUCTS;
  }
}

function writeAll(products) {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

function getAll() {
  return readAll();
}

function getById(id) {
  const products = readAll();
  return products.find(p => p.id === Number(id));
}

function create(data) {
  const products = readAll();
  const nextId = products.length > 0
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

  const product = {
    id: nextId,
    brand: data.brand.trim(),
    name: data.name.trim(),
    description: data.description.trim(),
    price: Number(data.price) || 0,
    badge: (data.badge || '').trim(),
    category: data.category || 'mujer',
    image: (data.image || '').trim()
  };

  products.push(product);
  writeAll(products);
  return product;
}

function update(id, data) {
  const products = readAll();
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    brand: data.brand.trim(),
    name: data.name.trim(),
    description: data.description.trim(),
    price: Number(data.price) || 0,
    badge: (data.badge || '').trim(),
    category: data.category || products[index].category,
    image: (data.image || '').trim()
  };

  writeAll(products);
  return products[index];
}

function remove(id) {
  const products = readAll();
  const filtered = products.filter(p => p.id !== Number(id));
  writeAll(filtered);
  return filtered.length !== products.length;
}

module.exports = { getAll, getById, create, update, remove };
