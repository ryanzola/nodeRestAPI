import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import productRoutes from "./api/routes/products";
import orderRoutes from "./api/routes/orders";
import userRoutes from "./api/routes/user";

const app = express();
mongoose.connect("mongodb://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PW + "@cluster0-shard-00-00-ta2bv.mongodb.net:27017,cluster0-shard-00-01-ta2bv.mongodb.net:27017,cluster0-shard-00-02-ta2bv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin", {useMongoClient: true})
mongoose.Promise = global.Promise;

// middleware
app.use(morgan("dev"));
app.use("/uploads", express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization, Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;