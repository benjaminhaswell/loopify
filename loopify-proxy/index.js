const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint for queueing a song
app.post('/api/queue', async (req, res) => {
  const { uri, accessToken } = req.body;
  if (!uri || !accessToken) {
    return res.status(400).json({ error: 'Missing uri or accessToken' });
  }

  const url = `https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A${uri}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      res.status(200).json({ message: 'Song queued successfully' });
    } else {
      const error = await response.json();
      console.log('Error:', error);
      res.status(response.status).json(error);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});