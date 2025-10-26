// api/get-audio-url.js

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Video ID is required' });
    return;
  }

  try {
    const command = `yt-dlp -g "https://www.youtube.com/watch?v=${id}"`;

    const { stdout } = await execAsync(command);
    const audioUrl = stdout.trim();

    if (!audioUrl) {
      res.status(404).json({ error: 'Audio URL not found' });
      return;
    }

    res.status(200).json({ url: audioUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get audio URL' });
  }
}
