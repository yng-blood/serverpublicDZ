// models/PdfModel.js

const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  pdfData: {
    type: Buffer, // Store PDF file data as Buffer
    required: true,
  },
});

const PdfModel = mongoose.model('Pdf', pdfSchema);

module.exports = PdfModel;