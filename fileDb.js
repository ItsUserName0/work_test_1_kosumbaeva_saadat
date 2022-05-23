const fs = require('fs');
const {nanoid} = require('nanoid');
const config = require('./config');
const File = require('./models/File');

module.exports = {
  async getFile(res, filename) {
    const fileMetaData = await File.findOne({filename});

    if (!fileMetaData) {
      return res.status(422).send({error: 'File not found!'});
    }

    const stream = fs.createReadStream(filename);

    res.set({
      'Content-Length': fileMetaData.contentLength,
      'Content-Type': fileMetaData.mimeType,
    });

    stream.pipe(res);
  },
  async addFile(data) {
    const ext = data.mimeType.split('/')[1];
    const filename = `${config.uploadPath}/${nanoid()}.${ext}`;

    const fileData = {
      filename,
      mimeType: data.mimeType,
      contentLength: data.contentLength,
    };

    const file = new File(fileData);
    await file.save();

    const stream = fs.createWriteStream(filename);
    stream.write(data.buffer);
  },
  async editFile(data, fileData) {
    const newData = {
      filename: fileData.filename,
      mimeType: data.mimeType,
      contentLength: data.contentLength,
    };

    await File.findByIdAndUpdate(fileData._id, newData);
    const stream = fs.createWriteStream(newData.filename);
    stream.write(data.buffer);
  }
}
