require('dotenv').config();
import pool from '../database';

exports.orders_get_all = (req, res) => {
  pool.connect()
    .then(client => {
      client.query('SELECT * FROM orders')
        .then(result => {
          client.release();
          res.status(200).json(result.rows);
        })
        .catch(err => {
          client.release();
          res.status(500).json({
            error: err.message
          });
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack); 
    });
};

exports.orders_create_order = (req, res) => {
  res.status(200).json({
    message: 'write this function please'
  });
};

exports.orders_get_order = (req, res) => {
  pool.connect()
    .then(client => {
      client.query(
        'SELECT * FROM orders WHERE _id = $1',
        [req.params.orderId],
      )
        .then(result => {
          client.release();
          res.status(200).json(result.rows[0]);
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

exports.orders_delete_order = (req, res) => {
  pool.connect()
    .then(client => {
      client.query('DELETE FROM orders WHERE _id = $1', 
        [req.params.orderId]
      )
        .then(() => {
          client.release();
          res.status(200).json({
            message: 'order deleted'
          });
        })
        .catch(err => {
          client.release();
          res.status(500).json(err);
        });
    })
    .catch(err => {
      console.error('connection error', err.message, err.stack); 
    });
};
