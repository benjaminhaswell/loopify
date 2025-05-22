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

// Proxy endpoint for playing next song
app.post('/api/next', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ error: 'Missing accessToken' });
  }

  const url = `https://api.spotify.com/v1/me/player/next`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      res.status(200).json({ message: 'Next song played successfully' });
    } else {
      const error = await response.json();
      console.log('Error:', error);
      res.status(response.status).json(error);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy endpoint for queueing a song
app.put('/api/seek', async (req, res) => {
  const { position, accessToken } = req.body;
  if (!position || !accessToken) {
    return res.status(400).json({ error: 'Missing position or accessToken' });
  }

  const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      res.status(200).json({ message: 'Seeked to successfully' });
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