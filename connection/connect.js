// connect.js
const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  mongoURI = "mongodb+srv://yngblo00d:yngblo00d@cluster0.6o0tbkr.mongodb.net/";
  const DB_OPTIONS = { dbName: "GYANGANGA" };

  try {
    // Use await directly on mongoose.connect, no need for then()
    await mongoose.connect(mongoURI, DB_OPTIONS);
    console.log("Connection with MongoDB is successful.");
  } catch (error) {
    // Use res.status instead of req.status
    console.error("Error connecting to MongoDB:", error);
    // Return a response with status 500 (Internal Server Error) when there is a database connection issue
    // Adjust the status code and response message as needed
    return {
      status: 500,
      message: "Database connection error",
    };
  }
};

// You can export the function to use it in other files if needed
module.exports = connectToMongoDB;

// Call the function to connect when the script is executed
connectToMongoDB();
