// api/search-tracks.js

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
    // Используем публичный инстанс invidious
    const invidiousUrl = `https://invidious.fdn.fr/api/v1/search?q=${encodeURIComponent(q)}&type=video&maxResults=10`;

    const response = await fetch(invidiousUrl);
    const data = await response.json();

    // Фильтруем и форматируем треки
    const tracks = data
      .filter(item => item.type === 'video' && item.duration > 0)
      .map(item => ({
        id: item.videoId,
        title: item.title,
        artist: item.author || 'Неизвестный исполнитель',
        duration: item.duration,
        url: `https://www.youtube.com/watch?v=${item.videoId}`, // Это пока YouTube URL
        thumbnailUrl: item.videoThumbnails?.[0]?.url || null
      }));

    res.status(200).json({ tracks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
}
