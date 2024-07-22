const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  pdfData: {name: String,
    data: Buffer,
    contentType: String
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;