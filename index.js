const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

const USGS_URL = 'https://waterservices.usgs.gov/nwis/iv/?sites=14128870&parameterCd=00065&format=json';

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get the water level
app.get('/water-level', async (req, res) => {
  try {
    const response = await axios.get(USGS_URL);
    const value = response.data.value.timeSeries[0].values[0].value[0].value;
    const feet = parseFloat(value);

   let status, message;

if (feet < 10) {
  status = 'Very Low';
  message = 'The water is unusually low — expect mud, rocks, and long walks to reach the water.';
} else if (feet < 13) {
  status = 'Low';
  message = 'Water is low but swimmable — bring your sandals and maybe a sense of adventure.';
} else if (feet < 15) {
  status = 'Medium';
  message = 'Conditions are pretty good! A solid day for swimming or lounging near the waterline.';
} else {
  status = 'High';
  message = 'Water is high, dont tread without a kayak.';
}

res.json({
  level: feet,
  status,
  message
});



  } catch (error) {
    console.error('Error fetching USGS data:', error);
    res.status(500).json({ error: 'Failed to fetch water level' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Rooster Rock API is running at http://localhost:${PORT}`);
});
