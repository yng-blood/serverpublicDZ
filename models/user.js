const mongoose = require('mongoose');
const Document = require('./PdfModel'); // Import the Document model

const UserSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    UserName: { type: String, required: true },
    Ph_No: { type: String, required: true },
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    documents: [{ type: mongoose.Types.ObjectId, ref: "Document" }] // Reference to documents associated with the user
});

module.exports = mongoose.model("USchema", UserSchema);