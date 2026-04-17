require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { inspectFood } = require('./services/foodInspection');

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer to store uploaded images in memory for processing
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ─────────────────────────────────────────────────────────
// PERSON 1 API ENDPOINT: FOOD INSPECTION
// ─────────────────────────────────────────────────────────
app.post('/api/inspect-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Convert memory buffer to base64 for Gemini Vision API
    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Simulate getting current environmental data (Person 3 can pass this later)
    const mockWeather = { temperature: 28.5, humidity: 74 };

    console.log(`[Person 1 API] Processing food image (${mimeType})`);
    
    // Execute the AI Analysis
    const analysis = await inspectFood(imageBase64, mimeType, mockWeather);
    
    // Return structured JSON data for Person 2 (Frontend) & Person 4 (Database)
    res.json(analysis);

  } catch (error) {
    console.error('Inspection failed:', error.message);
    res.status(500).json({ error: 'Failed to inspect food image using AI' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔥 Person 1 AI Isolated Backend running on http://localhost:${PORT}`);
  console.log(`Send POST /api/inspect-food with an 'image' form-data to test.`);
});
