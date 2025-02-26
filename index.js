const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");

const app = express();
const port = 3001;

app.use(cors());

dotenv.config();




const upload = multer({ dest: "uploads/" });


const PREDICTION_URL = process.env.PREDICTION_URL;
  
const PREDICTION_KEY = process.env.PREDICTION_KEY;
 

app.post("/predict", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
  
    const imageBuffer = fs.readFileSync(req.file.path);

    const response = await axios.post(PREDICTION_URL, imageBuffer, {
      headers: {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

   
    fs.unlinkSync(req.file.path);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing the image" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
