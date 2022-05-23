const express = require('express');
const db = require('../fileDb');
const config = require('../config');
const buffer = require('../middleware/buffer');
const File = require('../models/File');

const router = express.Router();

router.get('/:filename', async (req, res, next) => {
  try {
    await db.getFile(res, config.uploadPath + '/' + req.params.filename);
  } catch (e) {
    next(e);
  }
});

router.post('/', buffer, async (req, res, next) => {
  try {
    const data = {
      buffer: req.buffer,
      mimeType: req.mimeType,
      contentLength: req.contentLength,
    };

    await db.addFile(data);

    return res.send({message: 'Created successful'});
  } catch (e) {
    next(e);
  }
});

router.put('/:filename', buffer, async (req, res, next) => {
  try {
    const file = await File.findOne({filename: config.uploadPath + '/' + req.params.filename});

    if (!file) {
      return res.status(422).send({error: 'File not found!'});
    }

    const data = {
      buffer: req.buffer,
      mimeType: req.mimeType,
      contentLength: req.contentLength,
    };

    await db.editFile(data, file);

    return res.send({message: 'Updated successful'});
  } catch (e) {
    next(e);
  }
});

module.exports = router;

