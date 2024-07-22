const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json()); 
// MY MongoDB schema
const pdfSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});

const PdfModel = mongoose.model('Pdf', pdfSchema);

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb+srv://yngblo00d:yngblo00d@cluster0.6o0tbkr.mongodb.net/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Route to handle file upload
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { userId } = req.body;
    const { originalname, buffer } = req.file;

    const pdf = new PdfModel({
      userId: userId,
      filename: originalname,
      data: buffer,
    });
    await pdf.save();

    res.status(201).json({ message: 'PDF saved successfully' });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all PDF data
app.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await PdfModel.find();
    res.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Feedback received from ${name} (${email}): ${message}`);
  // Save feedback to database or process it as needed
  res.status(201).json({ message: 'Feedback received' });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
