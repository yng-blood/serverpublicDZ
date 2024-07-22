//list.js
const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const PdfModel =require("../models/PdfModel");
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // File naming
  }
});

const upload = multer({ storage: storage });

// Route for saving PDF document
router.post('/save-pdf', upload.single('pdf'), async (req, res) => {
  const { userId } = req.body; // Assuming you also send userId from the frontend

  try {
      const user = await USchema.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
      }

      const pdfPath = req.file.path; // Path to the uploaded PDF file
      const document = new Document({ user: userId, pdfPath });
      await document.save();
      // Associate the document with the user
      user.documents.push(document._id);
      await user.save();
      res.status(201).json({ message: "PDF saved successfully" });
  } catch (error) {
      console.error("Error saving PDF:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// second metjod 
router.post('/pdf', async (req, res) => {
  try {
    const images = req.files.images;
    const pdfDoc = await pdfLib.PDFDocument.create();
    for (let i = 0; i < images.length; i++) {
      const imageBytes = fs.readFileSync(images[i].path);
      const image = await pdfDoc.addImage(imageBytes);
      const page = pdfDoc.addPage();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error converting images to PDF');
  }
});

router.post('/M', async (req, res) => {
  try {
    const { userId, pdfData } = req.body; 
    const pdf = new PdfModel({ userId, pdfData });
    await pdf.save();
    res.status(201).json({ message: 'PDF saved successfully' });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
