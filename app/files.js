const express = require('express');
const db = require('../fileDb');
const buildFileData = require('../shared/utils/buildFileData');
const File = require('../models/File');

const router = express.Router();

router.get('/:fileId', async (req, res, next) => {
  try {
    await db.getFile(res, req.params.fileId);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await buildFileData(req.body);

    const fileData = await db.addFile(data);

    const resAnswer = {
      message: fileData ,
    }

    return res.send(resAnswer);
  } catch (e) {
    next(e);
  }
});

router.put('/:fileId', async (req, res, next) => {
  try {
    // const file = await getFileData(req.params.filename);
    const file = File.findById(req.params.fileId);

    if (!file) {
      return res.status(422).send({error: 'File not found!'});
    }

    const data = await buildFileData(req.body);

    const fileData = await db.editFile(data, file);

    return res.send(fileData);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

