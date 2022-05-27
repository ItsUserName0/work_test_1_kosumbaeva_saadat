const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const files = require('./app/files');
const cors = require('cors');
const app = express();

const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/files', files);
app.use(cors());
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));

const run = async () => {
  await mongoose.connect(config.mongo.db, config.mongo.options);

  app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));