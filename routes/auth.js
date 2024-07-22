//auth.js
const router = require('express').Router();
const User = require('../models/user');
const bcrypt =require("bcrypt");
const PdfModel =require("../models/PdfModel");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const File = require('../models/file.model');
const list =require("../models/list")


// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload_N_Files', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname,userId,buffer, mimetype }= req.file;

    const file = new File({
      name: originalname,
      userId:userId,
      data: buffer,
      contentType: mimetype,
    });

    await file.save();
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
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

router.post('/WelcomeHome', async (req, res) => {
   try {
     const { userName } = req.body;
     console.log('Received request for user:', userName);
 
     const user = await User.findOne({ UserName: userName });
 
     if (!user) {
       console.log('User not found');
       return res.status(404).json({ error: 'User not found' });
     }
 
     // Sending relevant user details to the frontend
     const { Email, Name, otherField } = user;
     console.log('Sending user details:', { Email, Name, otherField });
     res.status(200).json([{ Email, Name, otherField }]); // Wrap the details in an array
   } catch (error) {
     console.error('Error fetching user details:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });

 router.get('/all-data', async (req, res) => {
   try {
     const allData = await User.find(); // Fetch all records from the User model
     res.json(allData);
   } catch (error) {
     console.error('Error fetching all data:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
   // Signup Route
 router.post("/NSignup", async (req, res) => {
   try {
     const { Email, Password, Ph_No, Name, UserName } = req.body;
 
     // Check if email and username already exist
     const exUserE = await User.findOne({ Email });
     const exUserU = await User.findOne({ UserName });
 
     if (exUserE) {
       return res.status(400).json({ error: 'Email already exists' });
     }
     if (exUserU) {
       return res.status(400).json({ error: 'UserName already exists' });
     }
 
     // Hash the password before saving to the database
     const hashedPassword = await bcrypt.hash(Password, 10);
     const user = new User({ Email, Password: hashedPassword, Ph_No, Name, UserName });
     await user.save();
 
     console.log("User registered successfully:", user);
     // Send JSON response with redirect URL including user ID
     res.status(200).json({ redirectTo: `/UserHome/${user._id}` });
   } catch (error) {
     console.log("Error during registration:", error);
     res.status(500).json({ error: "Internal Server Error" });
   }
 });
 
 // Login Route
 router.post("/NLogin", async (req, res) => {
   try {
     const { Email, Password } = req.body;
 
     // Find user by email
     const user = await User.findOne({ Email });
     if (!user) {
       return res.status(400).json({ msg: "Email not found" });
     }
 
     // Compare passwords
     const isPasswordValid = await bcrypt.compare(Password, user.Password);
     if (!isPasswordValid) {
       return res.status(400).json({ msg: "Password incorrect" });
     }
 
     // Send JSON response with redirect URL including user ID
     return res.status(200).json({ redirectTo: `/UserHome/${user._id}` });
   } catch (error) {
     console.error("Error during login:", error);
     return res.status(500).json({ msg: "Internal Server Error" });
   }
 });
 
 // Get all users
 router.get("/users", async (req, res) => {
   try {
     const allUsers = await User.find();
     res.json(allUsers);
   } catch (error) {
     console.error('Error fetching users:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
 
 // Get user by ID
 router.get("/user/:userId", async (req, res) => {
   try {
     const user = await User.findById(req.params.userId);
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     res.json({ user });
   } catch (error) {
     console.error("Error fetching user:", error);
     res.status(500).json({ error: "Internal Server Error" });
   }
 });
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

  // Get all user data
  router.get('/all-data', async (req, res) => {
    try {
      const allData = await User.find();
      res.json(allData);
    } catch (error) {
      console.error('Error fetching all data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Get random user
  router.get('/random', async (req, res) => {
    try {
      const allUsers = await User.find();
      const randomIndex = Math.floor(Math.random() * allUsers.length);
      const randomUser = allUsers[randomIndex];
      res.json({ randomUser });
    } catch (error) {
      console.error('Error fetching random user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get("/user/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user }); // Wrap user data in an object before sending the response
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
  router.post('/save-pdf', async (req, res) => {
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




