require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Make sure this is set in your .env file

const corsOptions = {
  origin: 'http://localhost:3001', // Adjust this if your frontend is on a different port
};

app.use(cors(corsOptions));

app.post('/api/message', async (req, res) => {  
  const { message } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4", // Update this to the current model version
      prompt: message,
      temperature: 0.7,
      max_tokens: 50,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const botReply = response.data.choices[0].text.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error making request to OpenAI API:", error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send({
      message: 'An error occurred while generating a response.',
      detail: error.response ? error.response.data : error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
