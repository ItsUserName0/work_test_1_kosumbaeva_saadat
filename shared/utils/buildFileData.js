module.exports = buildFileData = async (fileData) => {
  const buffer = Buffer.from(fileData.buffer.data)
  return {
    buffer: buffer,
    mimeType: fileData.mimetype,
    contentLength: fileData.size,
  };
}