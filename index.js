const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const USGS_URL = 'https://waterservices.usgs.gov/nwis/iv/?sites=14128870&parameterCd=00065&format=json';

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(USGS_URL);
    const value = response.data.value.timeSeries[0].values[0].value[0].value;
    const feet = parseFloat(value);

    res.json({
      level: feet,
      swimmable: feet < 12,
      message: feet < 12 ? 'Safe to swim!' : 'Too high for swimming.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch water level' });
  }
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});


