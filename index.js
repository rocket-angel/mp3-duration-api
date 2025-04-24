const express = require('express');
const fileUpload = require('express-fileupload');
const mm = require('music-metadata');

const app = express();
app.use(fileUpload());

app.post('/duration', async (req, res) => {
  if (!req.files || !req.files.audio) {
    return res.status(400).json({ error: "No audio file uploaded under 'audio'" });
  }

  try {
    const buffer = req.files.audio.data;
    const metadata = await mm.parseBuffer(buffer, 'audio/mpeg');

    res.json({
      duration: metadata.format.duration,
      duration_rounded: Math.ceil(metadata.format.duration)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MP3 duration API running on port ${PORT}`);
});
