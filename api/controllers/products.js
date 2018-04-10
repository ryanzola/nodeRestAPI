require('dotenv').config();
import pool from '../database';


exports.products_get_all = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'SELECT * from products'
      )
        .then(result => {
          client.release();
          res.status(200).json(result.rows);
        })
        .catch(err => {
          client.release();
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack); 
    });
};

exports.products_create_product = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'INSERT INTO products(name, price, product_image) VALUES($1, $2, $3)',
        [req.body.name, req.body.price, req.file.path])
        .then(() => {
          client.release();
          res.redirect('/products');
        })
        .catch(err => {
          res.status(500).json({
            error: err.message
          });
        });
    })
    .catch(err => { 
      console.error('connection error', err.message, err.stack); 
    });
};

exports.products_get_product = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'SELECT * FROM products WHERE _id = $1',
        [req.params.productId],
      )
        .then(result => {
          res.status(200).json(result.rows[0]);
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => { 
      console.error('connection error', err.message, err.stack); 
    });
};

exports.products_edit_product = (req, res) => {
  // still doesnt work
  pool.connect()
    .then(client => {
      client.query(
        'UPDATE products SET name=$1, price=$2, product_image=$3 WHERE _id=$4',
        [req.body.name, req.body.price, req.file.path, req.params.productId]
      )
        .then(result => {
          client.release();
          console.info(result);
          res.redirect('/products');
        })
        .catch(err => { 
          client.release();
          console.error(err);
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack); 
    });

  // const id = req.params.productId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  // Product.update({ _id: id }, { $set: updateOps })
  //   .exec()
  //   .then(result => {
  //     console.info(result);
  //     res.status(200).json({
  //       message: 'product successfully updated',
  //       request: {
  //         type: 'GET',
  //         url: 'http//localhost:3000/products' + id
  //       }
  //     });
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     res.status(500).json(err);
  //   });
};

exports.products_delete_product = (req, res) => {
  pool.connect()
    .then(client => {
      client.query('DELETE FROM products WHERE id=$1', 
        [req.params.productId]
      )
        .then(() => {
          res.status(200);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack); 
    });
};
