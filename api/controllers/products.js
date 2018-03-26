const { Client } = require('pg');

const Product = require('../models/product');

// Database connection
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5433
});
client.connect();

exports.products_get_all = (req, res, next) => {
  client.query(
    'SELECT * from products'
  )
  .then(result => {
      res.status(200).json(result.rows);
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
};

exports.products_create_product = (req, res, next) => {
  client.query(
    'INSERT INTO products(name, price, productImage) VALUES($1, $2, $3)',
    [req.body.name, req.body.price, req.file.path],
    (err, result) => {
      if (err) console.log(err);

      res.redirect('/products');
    }
  );
};

exports.products_get_product = (req, res, next) => {
  client.query(
    'SELECT * FROM products WHERE _id = $1',
    [req.params.productId],
  )
  .then(result => {
    res.status(200).json(result.rows[0])
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
};

// untested
exports.products_edit_product = (req, res, next) => {
  client.query(
    'UPDATE products SET name=$1, price=$2, productImage=$3 WHERE _id=$4',
    [req.body.name, req.body.price, req.file.path, req.params.productId],
    (err, result) => {
      if (err) console.log(err);

      res.redirect('/products')
    }
  )
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'product successfully updated',
        request: {
          type: 'GET',
          url: 'http//localhost:3000/products' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.products_delete_product = (req, res, next) => {
  client.query('DELETE FROM products WHERE id=$1', 
  [req.params.productId],
  (err, result) => {
    res.status(200)
  }
)
};
