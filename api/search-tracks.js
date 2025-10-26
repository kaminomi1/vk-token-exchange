// api/search-tracks.js

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { q } = req.query;

  if (!q) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  try {
    // Пример команды yt-dlp для поиска (без скачивания)
    // Возвращает JSON с результатами
    // Убедись, что yt-dlp установлен как зависимость или доступен на Vercel
    const command = `yt-dlp "ytsearch5:${q}" --dump-json`;

    const { stdout } = await execAsync(command);

    const tracks = stdout
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const item = JSON.parse(line);
        return {
          id: item.id,
          title: item.title,
          artist: item.channel || 'Неизвестный исполнитель', // yt-dlp может не всегда давать artist
          duration: item.duration || 0,
          url: item.url, // Это будет временная ссылка на аудио
          thumbnailUrl: item.thumbnail || null
        };
      });

    res.status(200).json({ tracks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
}
