const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  contentLength: {
    type: String,
    required: true,
  },
});

const File = mongoose.model('File', FileSchema);
module.exports = File;