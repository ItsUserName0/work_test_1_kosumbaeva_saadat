const fs = require('fs');
const {nanoid} = require('nanoid');
const config = require('./config');
const File = require('./models/File');

module.exports = {
  async getFile(res, fileId) {
    const fileMetaData = await File.findById(fileId);

    if (!fileMetaData) {
      return res.status(422).send({error: 'File not found!'});
    }

    const stream = fs.createReadStream(`${config.uploadPath}/${fileId}`);

    res.set({
      'Content-Length': fileMetaData.contentLength,
      'Content-Type': fileMetaData.mimeType,
    });

    stream.pipe(res);
  },
  async addFile(data) {
    const ext = data.mimeType.split('/')[1];

    const fileData = {
      filename: `${config.uploadPath}/${nanoid()}.${ext}`,
      url: `http://localhost:8000/files/`,
      mimeType: data.mimeType,
      contentLength: data.contentLength,
    };

    const file = new File(fileData);
    file.url = `${file.url}${file._id.toString()}`;

    await file.save();

    const stream = fs.createWriteStream(`${config.uploadPath}/${file._id.toString()}`);
    stream.write(data.buffer);

    return File.findById(file._id.toString());
  },
  async editFile(data, fileData) {
    const newData = {
      url: fileData.url,
      filename: fileData.filename,
      mimeType: data.mimeType,
      contentLength: data.contentLength,
    };

    await File.findByIdAndUpdate(fileData._id, newData);

    const stream = fs.createWriteStream(`${config.uploadPath}/${fileData._id.toString()}`);
    stream.write(data.buffer);

    return File.findById(fileData._id.toString());
  }
}
