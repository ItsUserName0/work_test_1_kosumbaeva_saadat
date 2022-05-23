const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const files = require('./app/files');
const app = express();

const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/files', files);

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