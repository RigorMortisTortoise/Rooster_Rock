const express = require('express'); 
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

const USGS_URL = 'https://waterservices.usgs.gov/nwis/iv/?sites=14128870&parameterCd=00065&period=P1D&format=json';

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper: is a Date on "today" in America/Los_Angeles?
function isTodayInPST(date) {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' });
  const nowStr = fmt.format(new Date());
  const dStr = fmt.format(date);
  return nowStr === dStr;
}

// API endpoint to get the water level
    // Latest reading is the last item
app.get('/water-level', async (req, res) => {
  try {
    const response = await axios.get(USGS_URL);
    const readings = response.data.value.timeSeries[0].values[0].value;

    // Convert all readings to numbers
    const levels = readings.map(r => parseFloat(r.value));

    // Latest is last
    const feet = levels[levels.length - 1];
    const high = Math.max(...levels);
    const low = Math.min(...levels);

let status, message;

if (feet < 9) {
  status = 'Very Low';
  message = 'The water’s extra low today — you might barely get your toes wet crossing.';
} else if (feet < 13) {
  status = 'Low';
  message = 'A little water on your walk, but nothing to slow you down.';
} else if (feet < 15) {
  status = 'Medium';
  message = 'It’s a good wade — you can cross, just watch your footing.';
} else {
  status = 'High';
  message = 'The river’s running high — better bring a kayak or stay on shore.';
}


    res.json({
      level: feet,
      high,
      low,
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
